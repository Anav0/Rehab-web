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
  import { PropositionHelpers } from "@services/proposition";

  let treatments: Treatment[] = [];
  let selectedDate: number;
  let selectedTreatmentId: string;
  let isLoading = true;
  let isCalendarLoading = true;
  let dayModelByDayStr: Map<string, DayModel>;
  let hoveredTerm: Term = null;
  let hoveredInOverview: Term[];
  let propositionHelpers: PropositionHelpers = new PropositionHelpers();

  $: {
    if ($referralBeingScheduled) {
      updateTermsInfo($referralBeingScheduled.PatientId, selectedTreatmentId, new Date(selectedDate));
    }
  }

  const updateTermsInfo = async (patientId: string, treatmentId: string, date: Date) => {
    try {
      isCalendarLoading = true;
      const selectedDateAsDate = new Date(date);
      await buildDayModel(treatmentId, selectedDateAsDate);
      await buildTermsUsedByPatient(patientId);
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

  const buildPropositionHelpers = (proposition: Proposition) => {
    let posByTermId = new Map<number, number>();
    let termsByDayStr = new Map<string, Term[][]>();
    let termsIds = new Set<number>();
    for (let i = 0; i < proposition.ProposedTrms.length; i++) {
      const terms = proposition.ProposedTrms[i];
      let key = new Date(terms[0].StartDate).toDateString();
      for (let j = 0; j < terms.length; j++) {
        const term = terms[j];
        termsIds.add(term.Id);
        posByTermId.set(term.Id, i);
        term.StartDate = new Date(term.StartDate);
        term.EndDate = new Date(term.EndDate);
      }
      if (termsByDayStr.has(key)) {
        termsByDayStr.get(key).push(terms);
      } else {
        termsByDayStr.set(key, [terms]);
      }
    }
    propositionHelpers.PosByTermId = posByTermId;
    propositionHelpers.ProposedTerms = termsIds;
    propositionHelpers.TermsByDayStr = new Map(
      [...termsByDayStr.entries()].sort((a, b) => (new Date(a[0]) < new Date(b[0]) ? -1 : 1))
    );
  };

  const buildDayModel = async (treatmentId: string, startDate: Date) => {
    if (!treatmentId || !startDate) return;
    let buildDayModelByDayStr = new Map();
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
      if (buildDayModelByDayStr.has(term.StartDate.toDateString())) {
        let dayModel = buildDayModelByDayStr.get(term.StartDate.toDateString());
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
        buildDayModelByDayStr.set(term.StartDate.toDateString(), dayModel);
      }
    }
    dayModelByDayStr = buildDayModelByDayStr;
  };

  const buildTermsUsedByPatient = async (patientId: string) => {
    let from;
    let to;
    let payload: TermsUsedPayload = {
      From: from,
      To: to,
      PatientId: patientId,
    };
    const { data: termIds } = await api.terms.used(payload);
    propositionHelpers.TermsTakenByPatient = new Set(termIds);
  };

  proposition.subscribe(async (value) => {
    if (!value) return;
    try {
      if (propositionHelpers.TermsByDayStr.size == 0) {
        selectedDate = new Date(value.ProposedTrms[0][0].StartDate).getTime();
        buildTreatments(value);
      }
      for (let i = 0; i < value.ProposedTrms.length; i++) {
        const terms: Term[] = value.ProposedTrms[i];
        const firstTerm = terms[0];
        firstTerm["id"] = firstTerm.Id;
        firstTerm["hours"] = `${new Date(terms[0].StartDate).toLocaleTimeString("pl")} - ${new Date(
          terms[terms.length - 1].EndDate
        ).toLocaleTimeString("pl")}`;
      }
      buildPropositionHelpers(value);
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
    <ResultsCalendar {hoveredInOverview} {isCalendarLoading} bind:hoveredTerm {dayModelByDayStr} {propositionHelpers} />
    <ResultsOverview
      on:termSetHovered={({ detail: termSet }) => {
        hoveredInOverview = termSet;
      }}
      on:termSetSelected={({ detail: termSet }) => {
        selectedTreatmentId = termSet[0].TreatmentId;
        selectedDate = new Date(termSet[0].StartDate).getTime();
      }}
      {isLoading}
      proposedTermsByDay={propositionHelpers.TermsByDayStr}
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
