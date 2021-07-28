<script lang="ts">
  import { Content } from "carbon-components-svelte";
  import Navigation from "./components/Navigation.svelte";
  import SidePanel from "./components/SidePanel.svelte";
  import MainPanel from "./components/MainPanel.svelte";
  import ReferralPanel from "./components/side-panels/ReferralPanel.svelte";
  import Theme from "./components/Theme.svelte";
  import { PossibleTabs } from "./models/tabs";
  import "./css/main.css";
  import { onMount } from "svelte";
  import { api } from "./api";
  import { statuses } from "./stores/status";
  import { displayOnMain } from "./stores/mainPanel";

  let theme: "g10" = "g10";

  onMount(async () => {
    try {
      const { data: result } = await api.treatments.status(101);
      statuses.set(result);
    } catch (err) {
      console.error(err);
    }
  });
</script>

<Theme persist bind:theme>
  <Navigation />
  <Content>
    {#if $displayOnMain === "referral"}
      <SidePanel>
        <ReferralPanel />
      </SidePanel>
    {/if}
    <MainPanel />
  </Content>
</Theme>
