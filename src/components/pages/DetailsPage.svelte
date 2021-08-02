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

  let treatments: Treatment[] = [];
  let dates: Date[] = [];
  let startingPoint: Date = new Date(2021, 1, 1, 6, 0, 0);
  let isLoading = true;
  let terms: Term[] = [];
  let byDate: Map<string, Set<string>>;

  onMount(async () => {
    //$schedulingRequest.ReferralId = "1"; //"101715";
    //$schedulingRequest.Algorithm = "D";
    //const { data: result } = await api.scheduling.proposition($schedulingRequest);
    //$proposition = result;
    dates = getWorkdaysFromMondayOf(startingPoint, 10);

    byDate = new Map();

    let termId = 0;
    let mult = 60000;
    for (let i = 0; i < dates.length; i++) {
      const dt = dates[i];
      for (let j = 0; j < 20; j++) {
        let clonedDate = new Date(dt);
        clonedDate.setTime(clonedDate.getTime() + j * 20 * mult);
        let startDate = new Date(clonedDate);
        clonedDate.setTime(clonedDate.getTime() + 20 * mult);
        let endDate = clonedDate;
        let term = {
          Id: termId,
          Capacity: 1,
          Used: 0,
          Duration: 20,
          StartDate: startDate,
          EndDate: endDate,
          TreatmentId: "0",
          PlaceId: j % 2 ? 10 : 11,
          PlaceName: `Place ${j % 2 ? 10 : 11}`,
          TreatmentDuration: 20,
        };
        termId++;
        terms.push(term);
        if (byDate.has(startDate.toDateString())) {
          var set = byDate.get(startDate.toDateString());
          if (!set.has(term.PlaceName)) set.add(term.PlaceName);
        } else byDate.set(startDate.toDateString(), new Set([term.PlaceName]));
      }
    }
    console.log(byDate);
    isLoading = false;
  });

  proposition.subscribe((value) => {
    if (value == null) return;

    //date = new Date(value.ProposedTrms[0][0].StartDate);
    //dates = getWorkdaysFromMondayOf(date, 10);
    //console.log(date);
  });
</script>

<div class="details-page page">
  {#if isLoading}
    <span>Loading</span>
  {:else}
    <div class="details-panel">
      <Select labelText="Zabieg" on:change={({ detail }) => {}}>
        {#each treatments as item}
          <SelectItem value={item.Id} text={item.Name} />
        {/each}
      </Select>
      <DatePicker value={startingPoint.toLocaleString("pl", $dateFormat)}>
        <DatePickerInput labelText="Data" placeholder="dd.mm.yyy" />
      </DatePicker>
    </div>
    <div class="details-hours" />
    <div class="details-days">
      {#each [...byDate] as [dateStr, places]}
        <Day date={new Date(dateStr)} places={[...places]} />
      {/each}
    </div>
    <div class="details-timetable-wrapper">
      <div
        class="details-timetable"
        style="grid-template-columns: repeat(10,1fr); grid-template-rows: repeat({byDate.keys.length *
          byDate.values.length},1fr);"
      >
        {#each terms as term, i}
          <div class="{i % 2 ? 'full' : 'half'} details-timetable-item" on:click={() => console.log(term)}>
            {term.Id}/{term.PlaceId}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  * {
    box-sizing: border-box;
  }
  .details-page {
    --details-gap: 2px;
    --details-bg: var(--cds-ui-02);
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    grid-template-rows: auto auto 1fr 1fr;
    grid-template-areas:
      "toolbar toolbar ."
      ". hours hours"
      "days timetable timetable"
      "days timetable timetable";
  }
  .details-panel {
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 2rem;
    grid-area: toolbar;
  }
  .details-days {
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: 1fr;
    grid-area: days;
    background-color: var(--details-bg);
  }
  .details-hours {
    grid-area: hours;
  }

  .details-timetable-wrapper {
    background-color: var(--details-bg);
    width: 100%;
    height: 100%;
    grid-area: timetable;
  }

  .details-timetable-item:hover {
    opacity: 0.3;
    cursor: pointer;
  }

  .details-days {
    grid-gap: var(--details-gap);
    padding: var(--details-gap) 0 var(--details-gap) var(--details-gap);
  }

  .details-timetable {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(20, 1fr);
    grid-gap: var(--details-gap);
    padding: var(--details-gap);
  }
  .details-timetable-item {
    padding: 0.2rem;
    background-color: var(--cds-ui-01);
    width: 100%;
    height: 100%;
  }

  .full {
    border: 1px solid var(--cds-danger);
  }

  .half {
    border: 1px solid var(--cds-support-03);
  }
  .picked {
    border: 1px dotted var(--cds-active-primary);
  }
</style>
