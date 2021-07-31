<script lang="ts">
  import Day from "../Day.svelte";
  import { SelectItem, Select, DatePicker, DatePickerInput } from "carbon-components-svelte";
  import type { Treatment } from "../../models/treatment";
  import { proposition, schedulingRequest } from "../../stores/scheduling";
  import { dateFormat } from "../../stores/date";
  import { onMount } from "svelte";
  import { api } from "../../api";
  import { getWorkdaysFromMondayOf } from "../../services/dates";

  let treatments: Treatment[] = [];
  let dates: Date[] = [];
  let date: Date = null;
  let isLoading = true;

  onMount(async () => {
    $schedulingRequest.ReferralId = "1"; //"101715";
    $schedulingRequest.Algorithm = "D";
    const { data: result } = await api.scheduling.proposition($schedulingRequest);
    $proposition = result;
    isLoading = false;
  });

  proposition.subscribe((value) => {
    if (value == null) return;

    date = new Date(value.ProposedTrms[0][0].StartDate);
    dates = getWorkdaysFromMondayOf(date, 10);
    console.log(date);
  });
</script>

<div class="details-page">
  {#if isLoading}
    <span>Loading</span>
  {:else}
    <div class="details-panel">
      <Select labelText="Zabieg" on:change={({ detail }) => {}}>
        {#each treatments as item}
          <SelectItem value={item.Id} text={item.Name} />
        {/each}
      </Select>
      <DatePicker value={date.toLocaleString("pl", $dateFormat)}>
        <DatePickerInput labelText="Data" placeholder="dd.mm.yyy" />
      </DatePicker>
    </div>
    <div class="details-hours" />
    <div class="details-days">
      {#each dates as day}
        <Day date={day} places={["A", "B"]} />
      {/each}
    </div>
    <div class="details-timetable-wrapper">
      <div class="details-timetable">
        {#each Array(10) as _, i}
          <div class="details-timetable-item">hello</div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .details-page {
    grid-column: 1/6;
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
    grid-gap: 1px;
    grid-area: days;
    background-color: var(--cds-ui-04);
  }
  .details-hours {
    grid-area: hours;
  }

  .details-timetable-wrapper {
    background-color: var(--cds-ui-04);
    width: 100%;
    height: 100%;
    grid-area: timetable;
  }
  .details-timetable {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(12, 1fr);
    grid-gap: 2px;
  }
  .details-timetable-item {
    background-color: white;
  }
</style>
