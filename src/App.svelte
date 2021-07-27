<script lang="ts">
  import { Content } from "carbon-components-svelte";
  import Navigation from "./components/Navigation.svelte";
  import SideMenu from "./components/SideMenu.svelte";
  import MainPanel from "./components/MainPanel.svelte";
  import Theme from "./components/Theme.svelte";
  import { PossibleTabs } from "./models/tabs";
  import "./css/main.css";
  import Referral from "./components/Referral.svelte";

  let theme: "g10" = "g10";
  let requiredTab: PossibleTabs = PossibleTabs.Referral;
</script>

<Theme persist bind:theme>
  <Navigation />
  <Content>
    <SideMenu>
      {#if requiredTab === PossibleTabs.Referral}
        <span>Referral</span>
      {/if}
    </SideMenu>
    <MainPanel
      on:tabChanged={({ detail: tabName }) => (requiredTab = tabName)}
    />) />
  </Content>
</Theme>
