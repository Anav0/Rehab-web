<script lang="ts">
  import { displayOnMain } from "../../stores/mainPanel";
  import SettingsPage from "../pages/SettingsPage.svelte";
  import ReferralPage from "../pages/ReferralPage.svelte";
</script>

<div class="mainPanel">
  {#if $displayOnMain == "referral"}
    <ReferralPage />
  {:else if $displayOnMain == "settings"}<SettingsPage />
  {:else}
    <span>No page</span>
  {/if}
</div>

<style>
  .mainPanel {
    width: 100%;
    height: 100%;
  }
  .mainPanel :global(.bx--tab-content) {
    padding: 0;
  }
</style>
