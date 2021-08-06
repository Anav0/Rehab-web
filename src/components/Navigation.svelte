<script lang="ts">
  import {
    HeaderUtilities,
    HeaderGlobalAction,
    SkipToContent,
    Header,
  } from "carbon-components-svelte";
  import { getContext } from "svelte";
  import SettingsAdjust20 from "carbon-icons-svelte/lib/SettingsAdjust20";
  import { displayOnMain, prevPage } from "../stores/display";
  const ctx: { dark: any; light: any; updateVar: any } = getContext("Theme");

  let currentPage = $displayOnMain;

  $: {
    $prevPage = currentPage;
    currentPage = $displayOnMain;
  }

  $: if (ctx) {
    ctx.dark.subscribe((value) => {
      console.log("dark mode?", value);
    });
    ctx.light.subscribe((value) => {
      console.log("light mode?", value);
    });
    ctx.updateVar("--cds-productive-heading-06-font-size", "4rem");
  }
</script>

<Header company="Rehab scheduler" platformName="" href="/">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <HeaderUtilities>
    <HeaderGlobalAction
      aria-label="Settings"
      icon={SettingsAdjust20}
      on:click={() => {
        $displayOnMain = $displayOnMain === "settings" ? $prevPage : "settings";
      }}
    />
  </HeaderUtilities>
</Header>
