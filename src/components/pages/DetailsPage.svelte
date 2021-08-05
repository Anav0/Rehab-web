<script lang="ts">
  import Day from "../Day.svelte";
  import { SelectItem, Select, DatePicker, DatePickerInput, DataTableSkeleton } from "carbon-components-svelte";
  import type { Treatment } from "../../models/treatment";
  import { proposition } from "../../stores/scheduling";
  import { dateFormat } from "../../stores/date";
  import { api } from "../../api";
  import type { Term } from "../../models/term";
  import { DayModel, PlaceModel } from "../../models/calendar";
  import type { SchedulingProposition } from "../../models/proposition";
  import "flatpickr/dist/l10n/pl.js";
  import { getMonday } from "../../services/dates";
  import { onMount } from "svelte";
  import type { Referral } from "../../models/referral";
  import { get_all_dirty_from_scope } from "svelte/internal";

  let treatments: Treatment[] = [];
  let selectedDate: number;
  let selectedTreatmentId: string;
  let isLoading = true;
  let calendarLoading = true;
  let dayModelByDayStr: Map<string, DayModel>;
  let hoveredTerm: Term = null;
  let propositionTermsByTermId: Map<number, number>;

  $: buildHelperForTerms(selectedTreatmentId, new Date(selectedDate));

  const buildTreatments = (proposition: SchedulingProposition) => {
    let seenById: Set<string> = new Set();
    for (let i = 0; i < proposition.Referrals.length; i++) {
      const referral = proposition.Referrals[i];
      if (seenById.has(referral.TreatmentId)) continue;
      treatments.push({ Id: referral.TreatmentId, Name: referral.TreatmentName });
      seenById.add(referral.TreatmentId);
    }
  };
  const buildProposedTermsById = (proposition: SchedulingProposition) => {
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
    console.log(startDate);
    if (!treatmentId || !startDate) return;
    try {
      calendarLoading = true;
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
    } catch (err) {
      console.error(err);
    } finally {
      calendarLoading = false;
    }
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
      buildProposedTermsById(value);
      buildTreatments(value);
      selectedTreatmentId = treatments[0].Id;
      selectedDate = new Date(value.ProposedTrms[0][0].StartDate).getTime();
    } catch (err) {
      //TODO: show error
      console.error(err);
    } finally {
      isLoading = false;
    }
  });
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
    {#if calendarLoading}
      <DataTableSkeleton style="grid-row: 3/4; grid-column: 1/4; width:100%; height:100%;" />
    {:else}
      <div class="details-days">
        {#each [...dayModelByDayStr] as [dayStr, dayModel]}
          <Day {propositionTermsByTermId} {dayModel} on:termOver={({ detail: term }) => (hoveredTerm = term)} />
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
      "toolbar toolbar ."
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
  }
  .details-days {
    grid-gap: var(--details-gap);
    padding: var(--details-gap) 0 var(--details-gap) var(--details-gap);
  }
</style>
