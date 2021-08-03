<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import App from "../App.svelte";
  import type { DayModel } from "../models/calendar";
  import type { Term } from "../models/term";
  const dispatch = createEventDispatcher();

  export let dayModel: DayModel;
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
        <div class="day-place"><span>{placeName}</span></div>
        <div class="day-terms" style="grid-template-columns: repeat({placeModel.terms.length},1fr);">
          {#each placeModel.terms as term, k}
            <div class="day-term" on:mouseover={() => onMouseOver(term)} />
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
    padding: 0.25rem;
    display: grid;
    place-items: center;
  }
  .day-terms {
    display: grid;
    grid-template-rows: 1fr;
    grid-gap: 1px;
    width: 100%;
    height: 100%;
  }
  .day-place-wrapper {
    display: grid;
    grid-template-columns: 5rem 1fr;
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
  }
  .day-term {
    position: relative;
    transition: opacity 0.2s;
    padding: 0.2rem;
  }
</style>
