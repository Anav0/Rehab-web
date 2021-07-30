<script lang="ts">
  import { ComboBox, Tile, DatePicker, DatePickerInput, SelectSkeleton } from "carbon-components-svelte";
  import { statuses } from "../../stores/status";
  import { referralFilter } from "../../stores/referralFilters";

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
        $referralFilter.status = $statuses[index].Code;
      }}
    />
    <DatePicker
      datePickerType="range"
      valueTo={$referralFilter.to.toLocaleDateString("pl", dateFormat)}
      valueFrom={$referralFilter.from.toLocaleDateString("pl", dateFormat)}
      dateFormat="d.m.Y"
      locale="pl"
      on:change={({ detail }) => {
        $referralFilter.from = new Date(detail.selectedDates[0]);
        $referralFilter.to = new Date(detail.selectedDates[1]);
      }}
    >
      <DatePickerInput labelText="od" />
      <DatePickerInput labelText="Do" />
    </DatePicker>
  {/if}
</div>

<style>
  .referral-panel {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
    grid-gap: 2rem;
  }
</style>
