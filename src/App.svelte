<script lang="ts">
  import {
    Content,
    Breadcrumb,
    BreadcrumbItem,
    Grid,
    Row,
    Column,
    Tabs,
    Tab,
    Select,
    SelectItem,
  } from "carbon-components-svelte";
  import Navigation from "./components/Navigation.svelte";
  import SideMenu from "./components/SideMenu.svelte";
  import MainPanel from "./components/MainPanel.svelte";
  import Theme from "./components/Theme.svelte";
  import "./css/main.css";

  let theme: "g10" = "g10";
</script>

<Theme persist bind:theme>
  <Navigation />
  <Content>
    <SideMenu />
    <MainPanel />
  </Content>
</Theme>

<style>
  body :global(bx--content) {

  }
</style>
