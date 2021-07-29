<script lang="ts">
  import {
    DataTable,
    Button,
    Loading,
    DataTableSkeleton,
    ToastNotification,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import type { Term } from "../../models/term";
  import { proposition } from "../../stores/scheduling";

  let headers: DataTableHeader[] = [
    {
      key: "StartDate",
      value: "Proponowany termin",
      display: (date) => new Date(date).toLocaleString(),
      sort: (a, b) => (new Date(a) < new Date(b) ? -1 : 1),
    },
    {
      key: "PlaceName",
      value: "Miejsce wykonania",
    },
    { key: "TreatmentName", value: "Procedura" },
    { key: "action", empty: true },
  ];

  let rows: Term[] = [];

  proposition.subscribe((value) => {
    if (!value) return;
    for (let i = 0; i < value.ProposedTrms.length; i++) {
      const terms: Term[] = value.ProposedTrms[i];
      for (let j = 0; j < terms.length; j++) {
        const term = terms[j];
        term["id"] = term.Id;
        rows.push(term);
      }
    }
    rows = [...rows];
  });
</script>

<div class="result page">
  <DataTable
    title="Proponowane terminy dla zlecenia"
    description="Terminy proponowane przez program mogą zostać ręcznie dostosowane i autmatycznie sprawdzone"
    zebra
    sortable
    {headers}
    {rows}
  >
    <span slot="cell" let:cell let:row>
      {#if cell.key === "action"}
        <Button kind="tertiary">Dostosuj</Button>
      {:else if cell.key == "StartDate"}{cell.display(cell.value)}
      {:else}{cell.value}
      {/if}
    </span>
  </DataTable>
</div>

<style>
  .result {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
