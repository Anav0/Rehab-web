<script lang="ts">
  import { DataTable, Button, Loading, DataTableSkeleton, ToastNotification } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import { onMount } from "svelte";
  import { api } from "../../api";
  import type { Referral } from "../../models/referral";
  import { displayOnMain } from "../../stores/mainPanel";
  import { referralFilter } from "../../stores/referralFilters";
  import ReferralPanel from "../pages/ReferralPanel.svelte";

  import { proposition, schedulingRequest } from "../../stores/scheduling";
  import { statuses } from "../../stores/status";
  import { dateFormat } from "../../stores/date";
  import { errMsg, errTitle } from "../../stores/error";
  let rows: Referral[] = [];

  let fetchingReferrals = true;

  const fetchReferrals = async () => {
    fetchingReferrals = true;
    try {
      const { data: result } = await api.referral.referrals($referralFilter);

      for (let i = 0; i < result.length; i++) {
        const element = result[i];
        element["id"] = element.Id;
      }
      rows = result;
    } catch (err) {
      console.error(err.reponse);
      $errTitle = "Błąd przy pobieraniu zleceń";
      $errMsg = "Możliwy brak połączenia z serwerem";
      if (err.response) {
        $errMsg = err.Response.data.error;
      }
    } finally {
      fetchingReferrals = false;
    }
  };

  let headers: DataTableHeader[] = [
    {
      key: "Date",
      value: "Data wyk.",
      display: (date) => new Date(date).toLocaleDateString("pl", $dateFormat),
      sort: (a, b) => (new Date(a) < new Date(b) ? -1 : 1),
    },
    {
      key: "Status",
      value: "Status",
      display: (statusCode) => $statuses.find((x) => x.Code == statusCode).Name,
    },
    { key: "Surname", value: "Nazwisko" },
    { key: "FirstName", value: "Imię" },
    { key: "action", empty: true },
  ];

  let askForProposition = async (detail: any) => {
    isLoading = true;
    let referral = detail as Referral;
    $schedulingRequest.ReferralId = referral.Id.toString();
    try {
      const { data: result } = await api.scheduling.proposition($schedulingRequest);
      $proposition = result;
      $displayOnMain = "result";
    } catch (err) {
      if (err.response) {
        console.error(err.reponse);
        $errTitle = "Błąd przy wyznaczaniu termminów";
        $errMsg = "";
        if (err.response) {
          $errMsg = err.Response.data.error;
        }
      }
    } finally {
      isLoading = false;
    }
  };
  let isLoading = false;

  referralFilter.subscribe((value) => {
    if (value == null) return;
    fetchReferrals();
  });
</script>

<div class="referral page">
  <ReferralPanel />
  {#if isLoading}
    <Loading description="Trwa wyznaczanie terminów..." />
  {/if}
  {#if $errMsg != ""}
    <ToastNotification
      lowContrast
      style="position: absolute; top: 1rem; right: 4rem;"
      on:close={() => ($errMsg = "")}
      timeout={5000}
      title="$errTitle"
      subtitle={$errMsg}
    />
  {/if}
  {#if !fetchingReferrals && $statuses.length > 0}
    <DataTable
      title="Lista zleceń"
      description="Z poziomu tableki, można rozpocząć proces wyznaczania terminów"
      zebra
      sortable
      {headers}
      {rows}
    >
      <span slot="cell" let:cell let:row>
        {#if cell.key === "action"}
          <Button on:click={() => askForProposition(row)} kind="tertiary">Wyznacz</Button>
        {:else if cell.key == "Date"}{cell.display(cell.value)}
        {:else if cell.key == "Status"}{cell.display(cell.value)}
        {:else}{cell.value}
        {/if}
      </span>
    </DataTable>
  {:else}<DataTableSkeleton />
  {/if}
</div>

<style>
  .referral {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-gap: 2rem;
    overflow: auto;
  }
</style>
