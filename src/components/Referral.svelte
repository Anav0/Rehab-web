<script lang="ts">
  import { DataTable, Button, Loading } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import { api } from "../api";
  import type { Referral } from "../models/referral";
  import { referralFilter } from "../stores/referralFilters";
  import { schedulingRequest } from "../stores/scheduling";
  import { statuses } from "../stores/status";
  let allRows: Referral[] = [];
  let filteredRows: Referral[] = [];

  statuses.subscribe((value) => {
    allRows = [
      {
        id: "0",
        date: new Date(2019, 10, 10, 14, 25, 12),
        patient: { id: "10", name: "Jacek", surname: "Placek" },
        status: value[0],
        priority: "Pilne",
      },
      {
        id: "1",
        date: new Date(),
        patient: { id: "10", name: "Tomek", surname: "Placek" },
        status: value[1],
        priority: "Pilne",
      },
      {
        id: "2",
        date: new Date(),
        patient: { id: "10", name: "Jacek", surname: "Placek" },
        status: value[2],
        priority: "Pilne",
      },
      {
        id: "3",
        date: new Date(),
        patient: { id: "10", name: "Jacek", surname: "Placek" },
        status: value[2],
        priority: "Pilne",
      },
    ];
    filteredRows = allRows;
  });

  let headers: DataTableHeader[] = [
    {
      key: "date",
      value: "Data wyk.",
      display: (date) => new Date(date).toLocaleString(),
      sort: (a, b) => (new Date(a) < new Date(b) ? -1 : 1),
    },
    { key: "priority", value: "Priorytet" },
    { key: "status.Name", value: "Status" },
    { key: "patient.surname", value: "Nazwisko" },
    { key: "patient.name", value: "Imię" },
    { key: "action", empty: true },
  ];

  let askForProposition = async (detail: any) => {
    isLoading = true;
    let referral = detail as Referral;
    $schedulingRequest.ReferralId = referral.id;
    console.log($schedulingRequest);
    try {
      const { data: result } = await api.scheduling.proposition(
        $schedulingRequest
      );
      console.log(result);
    } catch (err) {
      //TODO: display error
    } finally {
      isLoading = false;
    }
  };
  let isLoading = false;

  referralFilter.subscribe((value) => {
    filteredRows = allRows;
    if (value == null) return;

    if (value.status)
      filteredRows = allRows.filter(
        (referral) => referral.status.Code == value.status.Code
      );
  });
</script>

<div class="referral">
  {#if isLoading}
    <Loading description="Trwa wyznaczanie terminów..." />
  {/if}
  <DataTable zebra sortable {headers} rows={filteredRows}>
    <span slot="cell" let:cell let:row>
      {#if cell.key === "action"}
        <Button on:click={() => askForProposition(row)} kind="tertiary"
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
