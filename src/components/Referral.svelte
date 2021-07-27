<script lang="ts">
  import { DataTable, Button, Loading } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import { Referral, ReferralStatus } from "../models/referral";

  let headers: DataTableHeader[] = [
    {
      key: "date",
      value: "Data wyk.",
      display: (date) => new Date(date).toLocaleString(),
      sort: (a, b) => (new Date(a) < new Date(b) ? -1 : 1),
    },
    { key: "priority", value: "Priorytet" },
    { key: "status", value: "Status" },
    { key: "patient.surname", value: "Nazwisko" },
    { key: "patient.name", value: "Imię" },
    { key: "action", empty: true },
  ];

  let rows: Referral[] = [
    {
      id: "0",
      date: new Date(2019, 10, 10, 14, 25, 12),
      patient: { id: "10", name: "Jacek", surname: "Placek" },
      status: ReferralStatus.Done,
      priority: "Pilne",
    },
    {
      id: "1",
      date: new Date(),
      patient: { id: "10", name: "Tomek", surname: "Placek" },
      status: ReferralStatus.Done,
      priority: "Pilne",
    },
    {
      id: "2",
      date: new Date(),
      patient: { id: "10", name: "Jacek", surname: "Placek" },
      status: ReferralStatus.ToDo,
      priority: "Pilne",
    },
    {
      id: "3",
      date: new Date(),
      patient: { id: "10", name: "Jacek", surname: "Placek" },
      status: ReferralStatus.Deleted,
      priority: "Pilne",
    },
  ];
  let startScheduling = (detail: any) => {
    isLoading = true;
    let referral = detail as Referral;
    console.log(referral);
    setTimeout(() => {
      isLoading = false;
    }, 1000);
  };
  let isLoading = false;
</script>

<div class="referral">
  {#if isLoading}
    <Loading description="Trwa wyznaczanie terminów..." />
  {/if}
  <DataTable zebra sortable {headers} {rows}>
    <span slot="cell" let:cell let:row>
      {#if cell.key === "action"}
        <Button on:click={() => startScheduling(row)} kind="tertiary"
          >Wyznacz</Button
        >
      {:else if cell.key == "date"}{cell.display(cell.value)}
      {:else}{cell.value}
      {/if}
    </span>
  </DataTable>
</div>

<style>
  .referral {
    width: 100%;
    height: 100%;
  }
</style>
