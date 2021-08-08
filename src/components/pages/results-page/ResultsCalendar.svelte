<script lang="ts">
  import "flatpickr/dist/l10n/pl.js";
  import ResultsDay from "@/components/pages/results-page/ResultsDay.svelte";
  import { DataTableSkeleton, Loading } from "carbon-components-svelte";
  import type { DayModel } from "@/models/calendar";
  import type { Term } from "@/models/term";

  export let isCalendarLoading: boolean;

  export let dayModelByDayStr: Map<string, DayModel> = new Map();
  export let termsUsedByPatient: Set<number> = new Set();
  export let propositionTermsByTermId: Map<Number, number> = new Map();
  export let hoveredTerm: Term;
  export let hoveredInOverview: Term;
</script>

<div class="results-days">
  {#if isCalendarLoading || !dayModelByDayStr}
    <Loading style="width:100%; height:100%;position: absolute; top:0;left:0;" />
  {/if}
  {#each [...dayModelByDayStr] as [_, dayModel]}
    <ResultsDay
      {termsUsedByPatient}
      {propositionTermsByTermId}
      {hoveredInOverview}
      {dayModel}
      on:termOver={({ detail: term }) => (hoveredTerm = term)}
    />
  {/each}
</div>

<style>
  .results-days {
    position: relative;
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: 1fr;
    grid-area: calendar;
    overflow: auto;
    grid-gap: var(--results-gap);
    padding: var(--results-gap);
  }
</style>
