<script lang="ts">
  import { ComboBox, SelectSkeleton } from "carbon-components-svelte";
  import { statuses } from "../../stores/status";
  import { referralFilter } from "../../stores/referralFilters";

  let items = [];
  statuses.subscribe((values) => {
    for (let i = 0; i < values.length; i++) {
      const status = values[i];
      items.push({ id: i, text: status.Name });
    }
    items = [...items];
  });
</script>

<div class="referral-panel">
  {#if items.length === 0}
    <SelectSkeleton />
  {:else}
    <ComboBox
      titleText="Status"
      placeholder="Wszyskie"
      {items}
      on:clear={() => {
        if (!$referralFilter) {
          $referralFilter = {
            status: null,
          };
        } else {
          $referralFilter.status = null;
        }
      }}
      on:select={({ detail }) => {
        let index = detail.selectedIndex;
        if (!$referralFilter) {
          $referralFilter = {
            status: $statuses[index],
          };
        } else {
          $referralFilter.status = $statuses[index];
        }
      }}
    />
  {/if}
</div>

<style>
  .referral-panel {
    height: 100%;
    width: 100%;
  }
</style>
