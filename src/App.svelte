<script lang="ts">
  import { Content, ToastNotification } from "carbon-components-svelte";
  import Navigation from "@/components/Navigation.svelte";
  import Theme from "@/components/Theme.svelte";
  import ReferralPage from "@/components/pages/ReferralPage.svelte";
  import SettingsPage from "@/components/pages/SettingsPage.svelte";
  import ResultsPage from "@/components/pages/results-page/ResultsPage.svelte";
  import { onMount } from "svelte";
  import { api } from "@/api";
  import { statuses } from "@/stores/status";
  import { displayOnMain } from "@/stores/display";
  import { errMsg, errTitle } from "@/stores/error";

  import "@/css/main.css";

  let theme: "g10" = "g10";

  onMount(async () => {
    try {
      const { data: result } = await api.treatments.status(101);
      statuses.set(result);
    } catch (err) {
      console.error(err);
      $errTitle = "Błąd przy pobieraniu statusów";
      $errMsg = "Możliwy brak połączenia z serwerem";
      if (err.response) {
        $errMsg = err.response.data.error;
      }
    }
  });
</script>

<Theme persist bind:theme>
  <Navigation />
  {#if $errTitle != ""}
    <ToastNotification
      lowContrast
      style="position: absolute; top: 5rem; right: 3rem;z-index: 10;"
      on:close={() => {
        $errTitle = "";
        $errMsg = "";
      }}
      timeout={5000}
      title={$errTitle}
      subtitle={$errMsg}
    />
  {/if}
  <Content>
    {#if $displayOnMain == "referral"}
      <ReferralPage />
    {:else if $displayOnMain == "settings"}<SettingsPage />
    {:else if $displayOnMain == "result"}<ResultsPage />
    {:else}
      <span>No page</span>
    {/if}
  </Content>
</Theme>
