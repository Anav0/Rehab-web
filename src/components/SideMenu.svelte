<script lang="ts">
  import { Tile } from "carbon-components-svelte";
</script>

<div class="sideMenu">
  <Tile>
    <slot name="content">No content was provided</slot>
  </Tile>
</div>

<style>
  .sideMenu {
    width: 100%;
    height: 100%;
  }
  .sideMenu :global(.bx--tile) {
    width: 100%;
    height: 100%;
  }
</style>
