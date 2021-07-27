<script lang="ts">
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import Referrals from "./Referral.svelte";
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
