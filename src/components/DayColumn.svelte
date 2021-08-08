<script lang="ts">
  import type { DayModel, PlaceModel } from "@models/calendar";
  import { Tile } from "carbon-components-svelte";
  import { dateFormat } from "@stores/misc";
  import { createEventDispatcher, onMount } from "svelte";
  import type { Term } from "@models/term";
  const dispatch = createEventDispatcher();

  export let terms: Term[];
  export let date: Date;

  let timeFormat: any = {
    hour: "2-digit",
    minute: "2-digit",
  };

  $: {
    terms.sort((a, b) => (a.StartDate < b.StartDate ? -1 : 1));
  }
</script>

<div class="day-column">
  <div class="day-column-header">
    <span class="day-column-header-date">{date.toLocaleString("pl", $dateFormat)}</span>
    <span>
      {terms[0].StartDate.toLocaleTimeString("pl", timeFormat)} - {terms[terms.length - 1].EndDate.toLocaleTimeString(
        "pl",
        timeFormat
      )}
    </span>
  </div>
  <div class="day-column-terms">
    {#each terms as term, i}
      <div class="day-column-entry" on:click={() => dispatch("termSelected", term)}>
        <p class="day-column-entry-date">
          {term.StartDate.toLocaleTimeString("pl", timeFormat)} - {term.EndDate.toLocaleTimeString("pl", timeFormat)}
        </p>
        <p class="day-column-entry-treatment">{term.TreatmentName}</p>
        <p class="day-column-entry-place">{term.PlaceName}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .day-column {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }
  .day-column-header {
    display: flex;
    flex-direction: column;
    background-color: var(--cds-ui-05);
    color: var(--cds-text-04);
    padding: 1rem;
    position: sticky;
    min-width: 10rem;
    top: 0;
    z-index: 20;
  }
  .day-column-header-date {
    margin-bottom: 0.3rem;
  }
  .day-column-terms {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .day-column-entry {
    background-color: var(--cds-ui-01);
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0.5rem 0.6rem;
    overflow: hidden;
    cursor: pointer;
    margin-top: 2px;
    border: 2px solid var(--cds-ui-01);
    transition: border-color 0.2s;
  }
  .day-column-entry:hover {
    border-color: var(--cds-active-primary);
  }
  .day-column-entry > p {
    font-size: 0.7rem;
  }
  .day-column-entry-treatment {
    font-style: italic;
  }
  .day-column-entry-place {
    margin-top: 0.25rem;
  }
  .day-column-entry-date {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
</style>
