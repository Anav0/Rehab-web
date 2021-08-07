<script lang="ts">
  import type { Term } from "@/models/term";
  import { dateFormat } from "@/stores/misc";
  import { DataTable } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";

  export let rows: Term[];
  let headers: DataTableHeader[] = [
    {
      key: "StartDate",
      value: "Data",
      display: (date) => new Date(date).toLocaleDateString("pl", $dateFormat),
      sort: (a, b) => (new Date(a) < new Date(b) ? -1 : 1),
    },
    {
      key: "hours",
      value: "Godziny",
    },
    {
      key: "PlaceName",
      value: "Miejsce wykonania",
    },
    { key: "TreatmentName", value: "Procedura" },
  ];
</script>

<DataTable
  title="Proponowane terminy dla zlecenia"
  description="Terminy proponowane przez program mogą zostać ręcznie dostosowane i autmatycznie sprawdzone"
  zebra
  sortable
  {headers}
  {rows}
/>

<style></style>
