<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { DayModel } from "@/models/calendar";
  import type { Term } from "@/models/term";
  import { areOverlapping, areOverlappingTwo } from "@services/term";
  import { proposition } from "@stores/scheduling";
  import type { Proposition } from "@api/payload-models";
  import type { PropositionHelpers } from "@services/proposition";

  const dispatch = createEventDispatcher();

  export let draggedTerm: Term = null;
  export let idOfTermBelow: number = null;
  export let termsUsedByPatient: Set<number>;

  export let dayModel: DayModel;
  export let propositionHelpers: PropositionHelpers;
  export let hoveredInOverview: Term[] = undefined;

  const onMouseOver = (term: Term) => {
    dispatch("termOver", term);
  };

  const handleDrop = (e, term: Term) => {
    //TODO: multi block treatments will not work
    let index = $proposition.ProposedTrms.findIndex((x) => x[0].Id == draggedTerm.Id);

    let changedTerm = $proposition.ProposedTrms[index];
    term.TreatmentDuration = changedTerm[0].TreatmentDuration;
    term.TreatmentName = changedTerm[0].TreatmentName;
    term.TreatmentId = changedTerm[0].TreatmentId;

    $proposition.ProposedTrms[index] = [term];
  };

  const handleDragEnter = (e, term: Term) => {
    dispatch("dragEntered", term);
  };

  const handleDragOver = (e, term: Term) => {
    if (!isAvailable(term)) return true;

    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  };

  const isAvailable = (termToCheck: Term) => {
    if (draggedTerm.Id == termToCheck.Id) return false;

    if (areOverlapping(termToCheck, draggedTerm)) return false;
    if (propositionHelpers.IdsOfFirstTerms.has(termToCheck.Id)) return false;

    for (let i = 0; i < $proposition.ProposedTrms.length; i++) {
      const proposedTrm = $proposition.ProposedTrms[i];
      if (areOverlappingTwo(termToCheck, proposedTrm)) return false;
    }

    return true;
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
        <div class="day-place">
          <p>{placeName}</p>
        </div>
        <div class="day-terms" style="grid-template-columns: repeat({placeModel.terms.length},1fr);">
          {#each placeModel.terms as term, k}
            <div
              on:dragstart={(e) => dispatch("startedDragging", term)}
              on:dragend={(e) => dispatch("stopedDragging", term)}
              on:dragover={(e) => handleDragOver(e, term)}
              on:dragenter={(e) => handleDragEnter(e, term)}
              on:dragleave={(e) => dispatch("dragLeave")}
              on:drop={(e) => handleDrop(e, term)}
              class:dropZone={draggedTerm && idOfTermBelow && idOfTermBelow == term.Id && isAvailable(term)}
              class:overview={hoveredInOverview && hoveredInOverview.find((x) => x.Id == term.Id)}
              class:unavailable={draggedTerm && !isAvailable(term)}
              class:available={draggedTerm && isAvailable(term)}
              draggable={propositionHelpers.IdsOfFirstTerms.has(term.Id)}
              class:proposed={propositionHelpers.IdsOfFirstTerms.has(term.Id)}
              class:used={termsUsedByPatient.has(term.Id)}
              class:overflow={term.Capacity < term.Used}
              class:full={term.Capacity == term.Used}
              class:some={term.Capacity / 2 <= term.Used}
              class="day-term"
              on:mouseenter={() => onMouseOver(term)}
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
    grid-template-columns: minmax(3ch, 14ch) auto;
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
    grid-gap: var(--results-gap);
  }
  .day-place > p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .day-place {
    background-color: var(--cds-ui-03);
    padding: 0.2rem;
    display: flex;
    place-items: center;
  }
  .day-terms {
    display: grid;
    grid-template-rows: 1fr;
    width: 100%;
    height: 100%;
    grid-gap: var(--results-gap);
  }
  .day-place-wrapper {
    display: grid;
    grid-template-columns: 7rem 1fr;
  }

  .day-term:hover::before {
    opacity: 0.5;
  }

  .day-term::before {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: "";
    transition: opacity 0.2s;
    will-change: opacity;
    background-color: var(--cds-ui-04);
    opacity: 0;
  }
  .day-term {
    position: relative;
    transition: opacity 0.2s;
    width: 100%;
    height: 100%;
    background-color: var(--cds-ui-01);
    border: var(--results-gap) solid transparent;
  }
  .dropZone {
    border-color: orange;
    border-style: dotted;
  }
  .unavailable {
    background-color: var(--cds-inverse-support-04) !important;
    border-color: var(--cds-inverse-support-04) !important;
  }
  .available {
    border-color: var(--cds-inverse-support-02) !important;
  }
  .some {
    background-color: var(--cds-support-03);
  }
  .full {
    background-color: #ff8833;
  }
  .overflow {
    background-color: var(--cds-support-01);
  }
  .proposed {
    border-color: var(--cds-active-primary);
    border-style: dashed;
  }
  .proposed:hover:before {
    opacity: 0.5;
    /* background-color: var(--cds-inverse-support-02); */
  }
  .proposed:hover {
    cursor: move;
  }
  .used {
    border-color: var(--cds-support-01);
    border-style: dashed;
  }
  .overview:before {
    opacity: 0.5;
  }
</style>
