<script lang="ts">
  import "flatpickr/dist/l10n/pl.js";
  import ResultsOverview from "@/components/pages/results-page/ResultsOverview.svelte";
  import ResultsPanel from "@/components/pages/results-page/ResultsPanel.svelte";
  import ResultsCalendar from "@/components/pages/results-page/ResultsCalendar.svelte";
  import type { Term } from "@/models/term";
  import type { Treatment } from "@/models/treatment";
  import { DayModel, PlaceModel } from "@/models/calendar";
  import { proposition, schedulingRequest } from "@/stores/scheduling";
  import { referralBeingScheduled } from "@/stores/referral";
  import { DataTableSkeleton } from "carbon-components-svelte";
  import type { Proposition, TermsUsedPayload } from "@/api/payload-models";
  import { errMsg, errTitle } from "@/stores/error";
  import { getMonday } from "@/services/dates";
  import { api } from "@/api";
  import { onMount } from "svelte";

  let proposedTerms: Term[] = [];
  let treatments: Treatment[] = [];
  let selectedDate: number;
  let selectedTreatmentId: string;
  let isLoading = true;
  let isCalendarLoading = true;
  let dayModelByDayStr: Map<string, DayModel>;
  let proposedTermsByDay: Map<string, Term[]>;
  let hoveredTerm: Term = null;
  let propositionTermsByTermId: Map<number, number>;
  let termsUsedByPatient: Set<number>;
  let hoveredInOverview: Term;

  $: {
    if ($referralBeingScheduled) {
      updateTermsInfo($referralBeingScheduled.PatientId, selectedTreatmentId, new Date(selectedDate));
    }
  }

  const updateTermsInfo = async (patientId: string, treatmentId: string, date: Date) => {
    try {
      isCalendarLoading = true;
      const selectedDateAsDate = new Date(date);
      await buildHelperForTerms(treatmentId, selectedDateAsDate);
      await buildTermsUsedByPatient(patientId, selectedDateAsDate);
    } catch (err) {
      console.error(err);
      $errTitle = "Błąd przy pobieraniu terminów";
      $errMsg = err.message;
      if (err.response) {
        $errMsg = err.response.data.error;
      }
    } finally {
      isCalendarLoading = false;
    }
  };

  const buildTreatments = (proposition: Proposition) => {
    let seenById: Set<string> = new Set();
    treatments = [];
    for (let i = 0; i < proposition.Referrals.length; i++) {
      const referral = proposition.Referrals[i];
      if (seenById.has(referral.TreatmentId)) continue;
      treatments.push({ Id: referral.TreatmentId, Name: referral.TreatmentName });
      seenById.add(referral.TreatmentId);
    }
  };

  const buildProposedTermsHelpers = (proposition: Proposition) => {
    let buildProposedTermsById = new Map();
    let buildingMap = new Map<string, Term[]>();
    for (let i = 0; i < proposition.ProposedTrms.length; i++) {
      const terms = proposition.ProposedTrms[i];
      for (let j = 0; j < terms.length; j++) {
        const term = terms[j];
        buildProposedTermsById.set(term.Id, terms.length);

        term.StartDate = new Date(term.StartDate);
        term.EndDate = new Date(term.EndDate);

        let key = term.StartDate.toDateString();
        if (buildingMap.has(key)) {
          buildingMap.get(key).push(term);
        } else {
          buildingMap.set(key, [term]);
        }
      }
    }
    propositionTermsByTermId = buildProposedTermsById;
    proposedTermsByDay = new Map([...buildingMap.entries()].sort((a, b) => (new Date(a[0]) < new Date(b[0]) ? -1 : 1)));
  };

  const buildHelperForTerms = async (treatmentId: string, startDate: Date) => {
    if (!treatmentId || !startDate) return;
    let buildingMap = new Map();
    let to = getMonday(startDate);
    let from = new Date(startDate);
    to.setDate(to.getDate() + 14);

    let { data: terms } = await api.terms.range({
      From: from,
      To: to,
      TreatmentId: treatmentId,
    });
    if (terms.length == 0) throw "Nie znaleziono terminów";

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      term.StartDate = new Date(term.StartDate);
      term.EndDate = new Date(term.EndDate);
      if (buildingMap.has(term.StartDate.toDateString())) {
        let dayModel = buildingMap.get(term.StartDate.toDateString());
        if (dayModel.placeModelsByPlaceName.has(term.PlaceName)) {
          let placeModel = dayModel.placeModelsByPlaceName.get(term.PlaceName);
          placeModel.terms.push(term);
        } else {
          let placeModel = new PlaceModel();
          placeModel.name = term.PlaceName;
          placeModel.terms.push(term);
          dayModel.placeModelsByPlaceName.set(term.PlaceName, placeModel);
        }
      } else {
        let dayModel = new DayModel();
        dayModel.date = term.StartDate;

        let placeModel = new PlaceModel();
        placeModel.name = term.PlaceName;
        placeModel.terms.push(term);

        dayModel.placeModelsByPlaceName.set(term.PlaceName, placeModel);
        buildingMap.set(term.StartDate.toDateString(), dayModel);
      }
    }
    dayModelByDayStr = buildingMap;
  };

  const buildTermsUsedByPatient = async (patientId: string, startDate: Date) => {
    let from;
    let to;
    let payload: TermsUsedPayload = {
      From: from,
      To: to,
      PatientId: patientId,
    };
    const { data: termIds } = await api.terms.used(payload);
    termsUsedByPatient = new Set(termIds);
  };

  proposition.subscribe(async (value) => {
    if (!value) return;
    try {
      if (proposedTerms.length == 0) {
        for (let i = 0; i < value.ProposedTrms.length; i++) {
          const terms: Term[] = value.ProposedTrms[i];
          const term = terms[0];
          term["id"] = term.Id;
          term["hours"] = `${new Date(terms[0].StartDate).toLocaleTimeString("pl")} - ${new Date(
            terms[terms.length - 1].EndDate
          ).toLocaleTimeString("pl")}`;

          proposedTerms.push(term);
        }
        proposedTerms = [...proposedTerms];
        selectedDate = new Date(value.ProposedTrms[0][0].StartDate).getTime();
        buildTreatments(value);
      }
      buildProposedTermsHelpers(value);
      if (!selectedTreatmentId) selectedTreatmentId = treatments[0].Id;
    } catch (err) {
      $errTitle = "Błąd przy wyświetlaniu terminów";
      $errMsg = err.message;
      if (!err.response) {
        $errMsg = err.response.data.error;
      }
      console.error(err);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="result page">
  <ResultsPanel bind:isLoading {treatments} bind:selectedTreatmentId bind:selectedDate {hoveredTerm} />
  {#if isLoading}
    <DataTableSkeleton style="width:100%;height:100%; grid-column: 1/4; grid-row: 2/4" />
  {:else}
    <ResultsCalendar
      {hoveredInOverview}
      {isCalendarLoading}
      bind:hoveredTerm
      {dayModelByDayStr}
      {termsUsedByPatient}
      {propositionTermsByTermId}
      {proposedTermsByDay}
    />
    <ResultsOverview
      on:termHovered={({ detail: term }) => {
        hoveredInOverview = term;
      }}
      on:termSelected={({ detail: term }) => {
        selectedTreatmentId = term.TreatmentId;
        selectedDate = new Date(term.StartDate).getTime();
      }}
      {isLoading}
      {proposedTermsByDay}
    />
  {/if}
</div>

<style>
  .result {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: grid;
    --results-gap: 2px;
    --results-bg: var(--cds-ui-03);
    grid-template-rows: auto 1.5fr 1fr;
    grid-template-areas:
      "panel panel panel"
      "calendar calendar calendar"
      "overview overview overview";
    grid-gap: 1rem;
  }
</style>
