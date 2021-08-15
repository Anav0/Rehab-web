<script lang="ts">
  import { DataTable, Button, Loading, DataTableSkeleton } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import { api } from "@/api";
  import type { Referral } from "@/models/referral";
  import { displayOnMain } from "@/stores/display";
  import { referralBeingScheduled, referralsRangePayload } from "@/stores/referral";
  import ReferralPanel from "@/components/pages/ReferralPanel.svelte";
  import ReferralDetails from "@/components/ReferralDetails.svelte";
  import { proposition, schedulingRequest } from "@/stores/scheduling";
  import { statuses } from "@/stores/status";
  import { dateFormat } from "@/stores/misc";
  import { errMsg, errTitle } from "@/stores/error";
  let rows: Referral[] = [];

  let fetchingReferrals = true;
  let isLoading = false;

  const fetchReferrals = async () => {
    fetchingReferrals = true;
    try {
      const { data: result } = await api.referral.referrals($referralsRangePayload);

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
        $errMsg = err.response.data.error;
      }
    } finally {
      fetchingReferrals = false;
    }
  };

  let headers: DataTableHeader[] = [
    {
      key: "Date",
      value: "Data zlec.",
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
    $referralBeingScheduled = referral;
    $schedulingRequest.ReferralId = referral.Id.toString();
    try {
      const { data: result } = await api.scheduling.proposition($schedulingRequest);
      $proposition = result;
      $displayOnMain = "result";
    } catch (err) {
      console.error(err);
      $errTitle = "Błąd przy wyznaczaniu terminów";
      $errMsg = "";
      if (err.response) {
        if (err.response) {
          $errMsg = err.response.data.error;
        }
      }
    } finally {
      isLoading = false;
    }
  };

  referralsRangePayload.subscribe((value) => {
    if (value == null) return;
    fetchReferrals();
  });
</script>

<div class="referral page">
  <ReferralPanel />
  {#if isLoading}
    <Loading description="Trwa wyznaczanie terminów..." />
  {/if}
  {#if !fetchingReferrals && $statuses.length > 0}
    <DataTable
      expandable
      title="Lista zleceń"
      description="Z poziomu tableki, można rozpocząć proces wyznaczania terminów"
      zebra
      sortable
      {headers}
      {rows}
    >
      <ReferralDetails model={row} let:row slot="expanded-row" />
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
