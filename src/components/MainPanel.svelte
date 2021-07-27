<script lang="ts">
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import Referrals from "./Referral.svelte";
  import { PossibleTabs } from "../models/tabs";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  onMount(() => {
    dispatch("tabChanged", PossibleTabs.Referral);
  });
</script>

<div class="mainPanel">
  <Tabs type="container">
    <Tab label="Zlecenia" />
    <div slot="content">
      <TabContent><Referrals /></TabContent>
    </div>
  </Tabs>
</div>

<style>
  .mainPanel :global(.bx--tab-content) {
    padding: 0;
  }
</style>
