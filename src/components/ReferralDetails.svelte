<script lang="ts">
  import { api } from "@api";
  import { TreeView, Tile, InlineLoading } from "carbon-components-svelte";
  import type { Referral, SubReferral } from "@models/referral";
  import { errMsg, errTitle } from "@stores/error";
  import { onMount } from "svelte";

  export let model: any;
  let tree: any = [];
  let expandedIds: number[] = [];
  let isLoading = true;
  function list_to_tree(list) {
    var map = {},
      node,
      roots = [],
      i;

    for (i = 0; i < list.length; i += 1) {
      list[i].id = list[i].Id;
      list[i].text = list[i].TreatmentName;
      delete list[i].TreatmentName;
      delete list[i].Level;
      delete list[i].Type;
      map[list[i].Id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.ParentId) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.ParentId]].children.push(node);
      } else {
        roots.push(node);
        expandedIds.push(node.Id);
      }
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i].children.length > 0) list[i].text += ` (${list[i].children.length})`;
      delete list[i].Id;
      delete list[i].ParentId;
    }
    return roots;
  }
  onMount(async () => {
    try {
      const { data: result } = await api.referral.getSubReferrals(model.Id);

      tree = list_to_tree(result);
    } catch (err) {
      console.error(err.reponse);
      $errTitle = "Błąd przy pobieraniu podlegych zleceń";
      $errMsg = "Możliwy brak połączenia z serwerem";
      if (err.response) {
        $errMsg = err.response.data.error;
      }
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="referral-details">
  {#if isLoading}<InlineLoading description="Wczytywanie zleceń" />{:else}
    <TreeView {expandedIds} children={tree} />
  {/if}
</div>

<style>
  .referral-details {
    padding: 0.5rem 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
</style>
