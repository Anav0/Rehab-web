<script lang="ts">
  import type { Term } from "@/models/term";
  import { DataTableSkeleton } from "carbon-components-svelte";
  import DayColumn from "@/components/DayColumn.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let proposedTermsByDay: Map<string, Term[][]>;
  export let isLoading: boolean;
</script>

<div style="grid-area: overview" class="results-overview-plan-wrapper">
  {#if isLoading || !proposedTermsByDay}
    <DataTableSkeleton />
  {:else}
    <div class="results-overview-plan">
      {#each [...proposedTermsByDay] as [dayStr, terms]}
        <DayColumn
          date={new Date(dayStr)}
          {terms}
          on:termSetSelected={({ detail: term }) => dispatch("termSetSelected", term)}
          on:termSetHovered={({ detail: term }) => dispatch("termSetHovered", term)}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .results-overview-plan-wrapper {
    background-color: var(--details-bg);
    height: 100%;
    width: 100%;
    overflow: auto;
  }

  .results-overview-plan {
    height: 100%;
    width: 100%;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    grid-gap: 0.3rem;
  }
</style>
