<script lang="ts">
  import "flatpickr/dist/l10n/pl.js";
  import ResultsDay from "@/components/pages/results-page/ResultsDay.svelte";
  import { Loading } from "carbon-components-svelte";
  import type { DayModel } from "@/models/calendar";
  import type { Term } from "@/models/term";
  import type { PropositionHelpers } from "@services/proposition";
  import { proposition } from "@stores/scheduling";

  export let isCalendarLoading: boolean;
  export let dayModelByDayStr: Map<string, DayModel> = new Map();
  export let propositionHelpers: PropositionHelpers;
  export let hoveredTerm: Term;
  export let hoveredInOverview: Term[];

  let isDragging = false;
  let draggedTerms: Term[] = null;
  let idOfTermBelow: number = null;
</script>

<div class="results-days" class:drag={isDragging}>
  {#if isCalendarLoading || !dayModelByDayStr}
    <Loading style="width:100%; height:100%;position: absolute; top:0;left:0;" />
  {/if}
  {#each [...dayModelByDayStr] as [_, dayModel]}
    <ResultsDay
      {draggedTerms}
      {propositionHelpers}
      {hoveredInOverview}
      {idOfTermBelow}
      {dayModel}
      on:termOver={({ detail: term }) => (hoveredTerm = term)}
      on:startedDragging={({ detail: term }) => {
        let pos = propositionHelpers.PosByTermId.get(term.Id);
        draggedTerms = $proposition.ProposedTrms[pos];
      }}
      on:stopedDragging={(_) => (draggedTerms = null)}
      on:dragEntered={({ detail: term }) => {
        idOfTermBelow = term.Id;
        hoveredTerm = term;
      }}
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
