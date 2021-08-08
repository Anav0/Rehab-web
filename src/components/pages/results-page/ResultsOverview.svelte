<script lang="ts">
  import type { Term } from "@/models/term";
  import { dateFormat } from "@/stores/misc";
  import type { DayModel } from "@models/calendar";
  import { DataTable, DataTableSkeleton } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import DayColumn from "@/components/DayColumn.svelte";

  export let dayModelByDayStr: Map<string, DayModel>;
  export let isLoading: boolean;
</script>

<div style="grid-area: overview" class="results-overview-plan-wrapper">
  {#if isLoading || !dayModelByDayStr}
    <DataTableSkeleton />
  {:else}
    <div class="results-overview-plan">
      {#each [...dayModelByDayStr] as [dayStr, dayModel]}
        <DayColumn {dayModel} />
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
