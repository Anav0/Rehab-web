<script lang="ts">
  import Day from "../Day.svelte";
  import { SelectItem, Select, Button, DatePicker, DatePickerInput, DataTableSkeleton } from "carbon-components-svelte";
  import type { Treatment } from "../../models/treatment";
  import { proposition, schedulingRequest } from "../../stores/scheduling";
  import { api } from "../../api";
  import type { Term } from "../../models/term";
  import { DayModel, PlaceModel } from "../../models/calendar";
  import "flatpickr/dist/l10n/pl.js";
  import { getMonday } from "../../services/dates";
  import { displayOnMain } from "../../stores/display";
  import Reset16 from "carbon-icons-svelte/lib/Reset16";
  import { errMsg, errTitle } from "../../stores/error";
  import type { Proposition, SchedulingPayload, TermsUsedPayload } from "../../api/payload-models";
  import { referralBeingScheduled } from "../../stores/referral";

  let treatments: Treatment[] = [];
  let selectedDate: number;
  let selectedTreatmentId: string;
  let isLoading = true;
  let calendarLoading = true;
  let dayModelByDayStr: Map<string, DayModel>;
  let hoveredTerm: Term = null;
  let propositionTermsByTermId: Map<number, number>;
  let termsUsedByPatient: Set<number>;

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

  const printInfoAboutHovered = () => {
    var dateStr = hoveredTerm.StartDate.toLocaleDateString("pl");
    var startTime = hoveredTerm.StartDate.toLocaleTimeString("pl", {
      hour: "2-digit",
      minute: "2-digit",
    });
    var endTime = hoveredTerm.EndDate.toLocaleTimeString("pl", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr}, ${startTime} - ${endTime}, ${hoveredTerm.PlaceName}, ${hoveredTerm.Id}, ${hoveredTerm.Used}/${hoveredTerm.Capacity}`;
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

  const goBackToResults = () => {
    $displayOnMain = "result";
  };

  let askForProposition = async () => {
    isLoading = true;
    try {
      const { data: result } = await api.scheduling.proposition($schedulingRequest);
      $proposition = result;
    } catch (err) {
      if (err.response) {
        $errTitle = "Błąd przy wyznaczaniu terminów";
        $errMsg = err.message;
        if (!err.response) {
          $errMsg = err.response.data.error;
        }
        console.error(err);
      }
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="details-page page">
  {#if isLoading}
    <span>Loading</span>
  {:else}
    <div class="details-panel">
      <div style="display:grid; grid-template-columns: auto 1fr;">
        <Select labelText="Zabieg" bind:selected={selectedTreatmentId}>
          {#each treatments as item}
            <SelectItem value={item.Id} text={item.Name} />
          {/each}
        </Select>
        <DatePicker
          dateFormat="d.m.Y"
          locale="pl"
          datePickerType="single"
          style="margin-left: 2rem"
          value={selectedDate}
          on:change={({ detail }) => (selectedDate = detail.selectedDates[0].getTime())}
        >
          <DatePickerInput labelText="Data" placeholder="dd.mm.yyy" />
        </DatePicker>
      </div>
      <span>{hoveredTerm ? printInfoAboutHovered() : ""}</span>
    </div>
    <div class="details-action">
      <Button kind="ghost" on:click={askForProposition} iconDescription="Wyznacz ponownie" icon={Reset16} />
      <Button kind="primary" on:click={goBackToResults}>Akceptuj</Button>
    </div>
    {#if calendarLoading}
      <DataTableSkeleton style="grid-row: 3/4; grid-column: 1/4; width:100%; height:100%;" />
    {:else}
      <div class="details-days">
        {#each [...dayModelByDayStr] as [dayStr, dayModel]}
          <Day
            {termsUsedByPatient}
            {propositionTermsByTermId}
            {dayModel}
            on:termOver={({ detail: term }) => (hoveredTerm = term)}
          />
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  * {
    box-sizing: border-box;
  }
  .details-page {
    --details-gap: 2px;
    --details-bg: var(--cds-ui-03);
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    grid-template-rows: auto auto 1fr 1fr;
    grid-column: 1/4;
    grid-template-areas:
      "toolbar toolbar action"
      ". hours hours"
      "days days days"
      "days days days";
  }
  .details-panel {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 2rem;
    grid-area: toolbar;
  }
  .details-days {
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: 1fr;
    grid-area: days;
    background-color: var(--details-bg);
    overflow: auto;
    grid-gap: var(--details-gap);
    padding: var(--details-gap);
  }
  .details-action {
    grid-area: action;
    place-self: end;
  }
</style>
