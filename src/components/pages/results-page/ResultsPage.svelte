<script lang="ts">
  import "flatpickr/dist/l10n/pl.js";
  import ResultsOverview from "@/components/pages/results-page/ResultsOverview.svelte";
  import ResultsPanel from "@/components/pages/results-page/ResultsPanel.svelte";
  import type { Term } from "@/models/term";
  import type { Treatment } from "@/models/treatment";
  import { DayModel, PlaceModel } from "@/models/calendar";
  import { proposition } from "@/stores/scheduling";
  import { referralBeingScheduled } from "@/stores/referral";
  import type { Proposition, TermsUsedPayload } from "@/api/payload-models";
  import { Loading } from "carbon-components-svelte";
  import { errMsg, errTitle } from "@/stores/error";
  import { getMonday } from "@/services/dates";
  import { api } from "@/api";

  let rows: Term[] = [];
  let treatments: Treatment[] = [];
  let selectedDate: number;
  let selectedTreatmentId: string;
  let isLoading = true;
  let calendarLoading = true;
  let dayModelByDayStr: Map<string, DayModel>;
  let hoveredTerm: Term = null;
  let propositionTermsByTermId: Map<number, number>;
  let termsUsedByPatient: Set<number>;

  proposition.subscribe((value) => {
    if (!value) return;
    rows = [];
    for (let i = 0; i < value.ProposedTrms.length; i++) {
      const terms: Term[] = value.ProposedTrms[i];
      const term = terms[0];
      term["id"] = term.Id;
      term["hours"] = `${new Date(terms[0].StartDate).toLocaleTimeString("pl")} - ${new Date(
        terms[terms.length - 1].EndDate
      ).toLocaleTimeString("pl")}`;

      rows.push(term);
    }
    rows = [...rows];
  });

  $: {
    updateTermsInfo($referralBeingScheduled.PatientId, selectedTreatmentId, new Date(selectedDate));
  }

  const updateTermsInfo = async (patientId: string, treatmentId: string, date: Date) => {
    try {
      calendarLoading = true;
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
      calendarLoading = false;
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

  const buildProposedTermsById = (proposition: Proposition) => {
    let buildProposedTermsById = new Map();
    for (let i = 0; i < proposition.ProposedTrms.length; i++) {
      const terms = proposition.ProposedTrms[i];
      for (let j = 0; j < terms.length; j++) {
        const term = terms[j];
        buildProposedTermsById.set(term.Id, terms.length);
      }
    }
    propositionTermsByTermId = buildProposedTermsById;
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
    if (value == null) return;
    try {
      selectedDate = new Date(value.ProposedTrms[0][0].StartDate).getTime();
      buildProposedTermsById(value);
      buildTreatments(value);
      selectedTreatmentId = treatments[0].Id;
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
  {#if isLoading}
    <Loading description="Trwa wyznaczanie terminów..." />
  {/if}
  <ResultsOverview {rows} />
  <ResultsPanel {treatments} {isLoading} {selectedTreatmentId} {selectedDate} {hoveredTerm} />
</div>

<style>
</style>
