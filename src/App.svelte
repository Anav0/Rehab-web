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
  import Theme from "./components/Theme.svelte";

  let theme: "g10" = "g10";
</script>

<Theme persist bind:theme>
  <Navigation />
  <Content>
    <span>Hello</span>
  </Content>
</Theme>
