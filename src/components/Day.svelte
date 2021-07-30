<script lang="ts">
  export let date: Date;
  export let places: string[];
</script>

<div class="day">
  <div class="day-date">
    <span
      >{date.toLocaleString("pl", {
        month: "2-digit",
        weekday: "short",
        day: "2-digit",
      })}</span
    >
  </div>
  <div class="day-places">
    {#each places as place, i}
      <div class="day-place"><span>{place}</span></div>
    {/each}
  </div>
</div>

<style>
  .day {
    display: flex;
  }
  .day-date {
    background-color: var(--cds-ui-05);
    padding: 1rem 2rem;
    display: flex;
    place-items: center;
  }
  .day-date span {
    color: var(--cds-text-04);
  }
  .day-places {
    display: grid;
    grid-auto-columns: 1fr;
    grid-template-columns: auto;
    grid-gap: 1px;
    background-color: var(--cds-ui-05);
  }
  .day-place {
    background-color: var(--cds-ui-03);
    padding: 0.5rem 1rem;
    display: flex;
    place-items: center;
  }
</style>
