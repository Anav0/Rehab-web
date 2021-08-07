<script lang="ts">
  import "flatpickr/dist/l10n/pl.js";
  import ResultsDay from "@/components/pages/results-page/ResultsDay.svelte";
  import { DataTableSkeleton } from "carbon-components-svelte";
  import type { DayModel } from "@/models/calendar";
  import type { Term } from "@/models/term";

  let calendarLoading = true;

  export let dayModelByDayStr: Map<string, DayModel>;
  export let termsUsedByPatient: Set<number>;
  export let propositionTermsByTermId: Map<Number, number>;
  export let hoveredTerm: Term;
</script>

<div>
  {#if calendarLoading}
    <DataTableSkeleton style="grid-row: 3/4; grid-column: 1/4; width:100%; height:100%;" />
  {:else}
    <div class="details-days">
      {#each [...dayModelByDayStr] as [_, dayModel]}
        <ResultsDay
          {termsUsedByPatient}
          {propositionTermsByTermId}
          {dayModel}
          on:termOver={({ detail: term }) => (hoveredTerm = term)}
        />
      {/each}
    </div>
  {/if}
</div>
