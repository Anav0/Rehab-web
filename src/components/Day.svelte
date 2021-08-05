<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import type { DayModel } from "../models/calendar";
  import type { Term } from "../models/term";
  const dispatch = createEventDispatcher();

  export let dayModel: DayModel;
  export let propositionTermsByTermId: Map<number, number>;

  const onMouseOver = (term: Term) => {
    dispatch("termOver", term);
  };
</script>

<div class="day">
  <div class="day-date">
    <span
      >{dayModel.date.toLocaleString("pl", {
        month: "2-digit",
        weekday: "short",
        day: "2-digit",
      })}</span
    >
  </div>
  <div class="day-places">
    {#each [...dayModel.placeModelsByPlaceName] as [placeName, placeModel], i}
      <div class="day-place-wrapper">
        <p class="day-place">{placeName}</p>
        <div class="day-terms" style="grid-template-columns: repeat({placeModel.terms.length},1fr);">
          {#each placeModel.terms as term, k}
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <div
              class:proposed={propositionTermsByTermId.has(term.Id)}
              class:some={term.Capacity / 2 <= term.Used}
              class:full={term.Capacity < term.Used}
              class="day-term"
              on:mouseover={() => onMouseOver(term)}
            />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .day {
    display: grid;
    grid-template-columns: 14ch auto;
  }
  .day-date {
    background-color: var(--cds-ui-05);
    display: grid;
    place-items: center;
  }
  .day-date span {
    color: var(--cds-text-04);
  }
  .day-places {
    display: grid;
    grid-auto-columns: 1fr;
    grid-template-columns: auto;
    grid-gap: var(--details-gap);
  }
  .day-place {
    background-color: var(--cds-ui-03);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .day-terms {
    display: grid;
    grid-template-rows: 1fr;
    width: 100%;
    height: 100%;
    grid-gap: var(--details-gap);
  }
  .day-place-wrapper {
    display: grid;
    grid-template-columns: 7rem 1fr;
  }

  .day-term:hover::after {
    opacity: 0.5;
    cursor: pointer;
  }

  .day-term::after {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    content: "";
    background-color: var(--cds-ui-01);
    transition: opacity 0.2s;
    will-change: opacity;
  }
  .day-term {
    position: relative;
    transition: opacity 0.2s;
  }
  .full::after {
    background-color: var(--cds-support-01) !important;
  }
  .some::after {
    background-color: var(--cds-support-03);
  }
</style>
