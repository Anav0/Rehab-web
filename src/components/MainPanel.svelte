<script lang="ts">
  import Referrals from "./Referral.svelte";
  import { displayOnMain } from "../stores/mainPanel";
</script>

<div class="mainPanel">
  {#if $displayOnMain == "referral"}
    <Referrals />
  {:else}<span>No content</span>
  {/if}
</div>

<style>
  .mainPanel :global(.bx--tab-content) {
    padding: 0;
  }
</style>
