<script lang="ts">
  import {
    ComboBox,
    DatePicker,
    DatePickerInput,
    SelectSkeleton,
  } from "carbon-components-svelte";
  import { statuses } from "../../../stores/status";
  import { referralFilter } from "../../../stores/referralFilters";

  let items = [];
  statuses.subscribe((values) => {
    for (let i = 0; i < values.length; i++) {
      const status = values[i];
      items.push({ id: i, text: status.Name });
    }
    items = [...items];
  });
  let dateFormat: any = {
    year: "numeric",
    day: "2-digit",
    month: "2-digit",
  };
</script>

<div class="referral-panel">
  {#if items.length === 0}
    <SelectSkeleton />
  {:else}
    <ComboBox
      titleText="Status"
      placeholder="Wszyskie"
      {items}
      on:clear={() => {
        $referralFilter.status = null;
      }}
      on:select={({ detail }) => {
        let index = detail.selectedIndex;
        $referralFilter.status = $statuses[index];
      }}
    />
  {/if}

  <DatePicker
    datePickerType="range"
    valueTo={$referralFilter.endDate.toLocaleDateString("pl", dateFormat)}
    valueFrom={$referralFilter.startDate.toLocaleDateString("pl", dateFormat)}
    dateFormat="d.m.Y"
    locale="pl"
    on:change={({ detail }) => {
      $referralFilter.startDate = new Date(detail.selectedDates[0]);
      $referralFilter.endDate = new Date(detail.selectedDates[1]);
    }}
  >
    <DatePickerInput labelText="od" />
    <DatePickerInput labelText="Do" />
  </DatePicker>
</div>

<style>
  .referral-panel {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(12, 1fr);
    grid-gap: 2rem;
  }
</style>
