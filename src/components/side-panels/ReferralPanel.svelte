<script lang="ts">
  import {
    Select,
    ComboBox,
    DatePicker,
    DatePickerInput,
    Button,
    SelectItem,
    SelectSkeleton,
  } from "carbon-components-svelte";
  import { statuses } from "../../stores/status";
  import { referralFilter } from "../../stores/referralFilters";
  import { schedulingRequest } from "../../stores/scheduling";

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
        if (!$referralFilter) {
          $referralFilter = {
            status: null,
          };
        } else {
          $referralFilter.status = null;
        }
      }}
      on:select={({ detail }) => {
        let index = detail.selectedIndex;
        if (!$referralFilter) {
          $referralFilter = {
            status: $statuses[index],
          };
        } else {
          $referralFilter.status = $statuses[index];
        }
      }}
    />
  {/if}

  <Select
    selected={$schedulingRequest.Algorithm}
    labelText="Algorytm użyty do wyznaczania"
    on:change={({ detail }) => {
      $schedulingRequest.Algorithm = detail;
    }}
  >
    <SelectItem value="SA" text="Wyżarzanie" />
    <SelectItem value="D" text="Deterministyczny" />
  </Select>

  <DatePicker
    datePickerType="range"
    valueTo={$schedulingRequest.End.toLocaleDateString("pl", dateFormat)}
    valueFrom={$schedulingRequest.Start.toLocaleDateString("pl", dateFormat)}
    dateFormat="d.m.Y"
    locale="pl"
    on:change={({ detail }) => {
      $schedulingRequest.Start = new Date(detail.selectedDates[0]);
      $schedulingRequest.End = new Date(detail.selectedDates[1]);
    }}
  >
    <DatePickerInput labelText="Od" />
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
