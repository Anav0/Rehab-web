<script lang="ts">
  import Day from "../Day.svelte";
  import { SelectItem, Select, DatePicker, DatePickerInput } from "carbon-components-svelte";
  import type { Treatment } from "../../models/treatment";
  import { proposition, schedulingRequest } from "../../stores/scheduling";
  import { dateFormat } from "../../stores/date";
  import { onMount } from "svelte";
  import { api } from "../../api";
  import { getWorkdaysFromMondayOf } from "../../services/dates";
  import type { Term } from "../../models/term";
  import { DayModel, PlaceModel } from "../../models/calendar";
  import type { SchedulingProposition } from "../../models/proposition";

  let treatments: Treatment[] = [];
  let startingPoint: Date = new Date(2021, 1, 1, 6, 0, 0);
  let isLoading = true;
  let dayModelByDayStr: Map<string, DayModel>;
  let hoveredTerm: Term = null;
  let propositionTermsByTermId: Map<number, number> = new Map();

  onMount(() => {
    $proposition = {
      ProposedTrms: [],
      ReferralIds: [],
    };
  });

  const buildTermsById = (proposition: SchedulingProposition) => {
    for (let i = 0; i < proposition.ProposedTrms.length; i++) {
      const terms = proposition.ProposedTrms[i];
      for (let j = 0; j < terms.length; j++) {
        const term = terms[j];
        propositionTermsByTermId.set(term.Id, terms.length);
      }
    }
  };

  proposition.subscribe(async (value) => {
    if (value == null) {
      return;
    }
    try {
      buildTermsById(value);
      let buildingMap = new Map();
      //startingPoint = new Date(value.ProposedTrms[0][0].StartDate);
      startingPoint = new Date(2018, 8, 1, 0, 0, 0);

      let { data: terms } = await api.terms.range({
        From: startingPoint,
        To: new Date(2018, 8, 14, 23, 59, 59, 0),
        TreatmentId: "2159",
      });
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
      console.log(dayModelByDayStr);
    } catch (err) {
      //TODO: show error
      console.error(err);
    } finally {
      isLoading = false;
    }
  });

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
</script>

<div class="details-page page">
  {#if isLoading}
    <span>Loading</span>
  {:else}
    <div class="details-panel">
      <div style="display:grid; grid-template-columns: auto 1fr;">
        <Select labelText="Zabieg" on:change={({ detail }) => {}}>
          {#each treatments as item}
            <SelectItem value={item.Id} text={item.Name} />
          {/each}
        </Select>
        <DatePicker style="margin-left: 2rem" value={startingPoint.toLocaleString("pl", $dateFormat)}>
          <DatePickerInput labelText="Data" placeholder="dd.mm.yyy" />
        </DatePicker>
      </div>
      <span>{hoveredTerm ? printInfoAboutHovered() : "Nic"}</span>
    </div>
    <!-- <div class="details-hours" style="grid-template-columns: repeat({hours.length},1fr);">
      {#each hours as hour}
        <div>{hour}</div>
      {/each}
    </div> -->
    <div class="details-days">
      {#each [...dayModelByDayStr] as [dayStr, dayModel]}
        <Day {propositionTermsByTermId} {dayModel} on:termOver={({ detail: term }) => (hoveredTerm = term)} />
      {/each}
    </div>
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
    margin-bottom: 2rem;
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
  .details-hours {
    grid-area: hours;
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-rows: 1fr;
  }

  .details-days {
    grid-gap: var(--details-gap);
    padding: var(--details-gap) 0 var(--details-gap) var(--details-gap);
  }
</style>
