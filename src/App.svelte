<script lang="ts">
  import { Content } from "carbon-components-svelte";
  import Navigation from "./components/Navigation.svelte";
  import Theme from "./components/Theme.svelte";
  import ReferralPage from "./components/pages/ReferralPage.svelte";
  import SettingsPage from "./components/pages/SettingsPage.svelte";
  import ResultsPage from "./components/pages/ResultsPage.svelte";
  import DetailsPage from "./components/pages/DetailsPage.svelte";

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
    {#if $displayOnMain == "referral"}
      <ReferralPage />
    {:else if $displayOnMain == "settings"}<SettingsPage />
    {:else if $displayOnMain == "result"}<ResultsPage />
    {:else if $displayOnMain == "details"}<DetailsPage />
    {:else}
      <span>No page</span>
    {/if}
  </Content>
</Theme>
