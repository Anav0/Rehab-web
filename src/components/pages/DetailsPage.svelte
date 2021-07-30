<script lang="ts">
  import Day from "../Day.svelte";
</script>

<div class="details-page page">
  <Day date={new Date()} places={["A", "B"]} />
</div>

<style>
  .details-page {
    display: grid;
    grid-template-rows: repeat(12, 1fr);
    grid-template-columns: auto;
  }
</style>
