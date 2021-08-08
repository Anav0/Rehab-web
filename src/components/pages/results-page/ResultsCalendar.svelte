<script lang="ts">
  import "flatpickr/dist/l10n/pl.js";
  import ResultsDay from "@/components/pages/results-page/ResultsDay.svelte";
  import { DataTableSkeleton } from "carbon-components-svelte";
  import type { DayModel } from "@/models/calendar";
  import type { Term } from "@/models/term";

  export let isLoading: boolean;

  export let dayModelByDayStr: Map<string, DayModel>;
  export let termsUsedByPatient: Set<number> = new Set();
  export let propositionTermsByTermId: Map<Number, number> = new Map();
  export let hoveredTerm: Term;
</script>

<div class="results-days">
  {#if isLoading || !dayModelByDayStr}
    <DataTableSkeleton style="width:100%; height:100%;" />
  {:else}
    {#each [...dayModelByDayStr] as [_, dayModel]}
      <ResultsDay
        {termsUsedByPatient}
        {propositionTermsByTermId}
        {dayModel}
        on:termOver={({ detail: term }) => (hoveredTerm = term)}
      />
    {/each}
  {/if}
</div>

<style>
  .results-days {
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: 1fr;
    grid-area: calendar;
    overflow: auto;
    grid-gap: var(--results-gap);
    padding: var(--results-gap);
  }
</style>
