<script lang="ts">
  import { Content } from "carbon-components-svelte";
  import Navigation from "./components/Navigation.svelte";
  import SideMenu from "./components/SideMenu.svelte";
  import MainPanel from "./components/MainPanel.svelte";
  import ReferralPanel from "./components/side-panels/ReferralPanel.svelte";
  import Theme from "./components/Theme.svelte";
  import { PossibleTabs } from "./models/tabs";
  import "./css/main.css";
  import { onMount } from "svelte";
  import { api } from "./api";
  import { statuses } from "./stores/status";

  let theme: "g10" = "g10";
  let requiredTab: PossibleTabs = PossibleTabs.Referral;

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
    <SideMenu>
      {#if requiredTab === PossibleTabs.Referral}
        <ReferralPanel />
      {/if}
    </SideMenu>
    <MainPanel
      on:tabChanged={({ detail: tabName }) => (requiredTab = tabName)}
    />
  </Content>
</Theme>
