<script lang="ts">
  import { ComboBox, DatePicker, DatePickerInput, SelectSkeleton } from "carbon-components-svelte";
  import { statuses } from "../../stores/status";
  import { dateFormat } from "../../stores/misc";
  import "flatpickr/dist/l10n/pl.js";
  import { referralsRangePayload } from "../../stores/referral";
  import { get_all_dirty_from_scope } from "svelte/internal";

  let items = [];

  statuses.subscribe((values) => {
    for (let i = 0; i < values.length; i++) {
      const status = values[i];
      items.push({ id: i, text: status.Name });
    }
    items = [...items];
  });
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
        $referralsRangePayload.status = null;
      }}
      on:select={({ detail }) => {
        let index = detail.selectedIndex;
        $referralsRangePayload.status = $statuses[index].Code;
      }}
    />
    <DatePicker
      datePickerType="range"
      valueTo={$referralsRangePayload.to.toLocaleDateString("pl", $dateFormat)}
      valueFrom={$referralsRangePayload.from.toLocaleDateString("pl", $dateFormat)}
      dateFormat="d.m.Y"
      locale="pl"
      on:change={({ detail }) => {
        //INFO: use copy not to trigger two request on referralsRange change
        const newFrom = new Date(detail.selectedDates[0]);
        const newTo = new Date(detail.selectedDates[1]);

        if (
          newFrom.getTime() != $referralsRangePayload.from.getTime() ||
          newTo.getTime() != $referralsRangePayload.to.getTime()
        ) {
          let copy = { ...$referralsRangePayload };
          copy.from = newFrom;
          copy.to = newTo;
          $referralsRangePayload = copy;
        }
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
