<script lang="ts">
  import { DataTable, Loading, ToastNotification, Button } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import type { Term } from "../../models/term";
  import { proposition } from "../../stores/scheduling";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Reset16 from "carbon-icons-svelte/lib/Reset16";
  import Calibrate16 from "carbon-icons-svelte/lib/Calibrate16";
  import { displayOnMain } from "../../stores/mainPanel";
  import { schedulingRequest } from "../../stores/scheduling";
  import { api } from "../../api";
  import { dateFormat } from "../../stores/date";
  import { errMsg, errTitle } from "../../stores/error";

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
  let rows: Term[] = [];

  proposition.subscribe((value) => {
    if (!value) return;
    rows = [];
    for (let i = 0; i < value.ProposedTrms.length; i++) {
      const terms: Term[] = value.ProposedTrms[i];
      const term = terms[0];
      term["id"] = term.Id;
      term["hours"] = `${new Date(terms[0].StartDate).toLocaleTimeString("pl")} - ${new Date(
        terms[terms.length - 1].EndDate
      ).toLocaleTimeString("pl")}`;

      rows.push(term);
    }
    rows = [...rows];
  });
  let isLoading = false;
  let askForProposition = async () => {
    isLoading = true;
    try {
      const { data: result } = await api.scheduling.proposition($schedulingRequest);
      $proposition = result;
    } catch (err) {
      console.error(err);
      $errTitle = "Błąd przy wyznaczaniu terminów";
      if (err.response) {
        $errMsg = err.response.data.error;
      }
    } finally {
      isLoading = false;
    }
  };
  let goToDetails = () => {
    $displayOnMain = "details";
  };
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore missing-declaration -->
<div class="result page">
  {#if isLoading}
    <Loading description="Trwa wyznaczanie terminów..." />
  {/if}
  {#if $errTitle != ""}<div/>{/if}
  <DataTable
    title="Proponowane terminy dla zlecenia"
    description="Terminy proponowane przez program mogą zostać ręcznie dostosowane i autmatycznie sprawdzone"
    zebra
    sortable
    {headers}
    {rows}
  >
    <div class="result-toolbar">
      <Button
        on:click={() => {
          $displayOnMain = "referral";
          $proposition = null;
        }}
        kind="danger"
        iconDescription="Przerwij wyznaczanie"
        icon={TrashCan16}
      />
      <Button kind="ghost" on:click={askForProposition} iconDescription="Wyznacz ponownie" icon={Reset16} />
      <Button kind="ghost" on:click={goToDetails} iconDescription="Dostosuj ręcznie" icon={Calibrate16} />
      <Button kind="primary">Akceptuj</Button>
    </div>
  </DataTable>
</div>

<style>
  .result {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .result-toolbar {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }
</style>
