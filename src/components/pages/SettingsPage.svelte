<script lang="ts">
  import { ButtonSet, Button } from "carbon-components-svelte";
  import { SelectItem, Select, DatePicker, DatePickerInput } from "carbon-components-svelte";
  import { dateFormat } from "@/stores/misc";
  import { displayOnMain, prevPage } from "@/stores/display";
  import { schedulingRequest } from "@/stores/scheduling";
  import "flatpickr/dist/l10n/pl.js";
  import { SchedulingApi } from "@api/scheduling-api";

  let shadowSettings = { ...$schedulingRequest };

  const goToPrevPage = () => {
    $displayOnMain = $prevPage;
  };
  const accept = () => {
    $schedulingRequest = { ...shadowSettings };
    goToPrevPage();
  };
</script>

<div class="settings-page page">
  <div class="settings">
    <DatePicker
      datePickerType="range"
      valueTo={shadowSettings.End.toLocaleDateString("pl", $dateFormat)}
      valueFrom={shadowSettings.Start.toLocaleDateString("pl", $dateFormat)}
      dateFormat="d.m.Y"
      locale="pl"
      on:change={({ detail }) => {
        shadowSettings.Start = new Date(detail.selectedDates[0]);
        shadowSettings.Start.setHours(8, 0, 0);
        shadowSettings.End = new Date(detail.selectedDates[1]);
        shadowSettings.End.setHours(18, 0, 0); //TODO: take from DB
      }}
    >
      <DatePickerInput labelText="Od" />
      <DatePickerInput labelText="Do" />
    </DatePicker>
  </div>
  <ButtonSet style="margin-top: 3rem">
    <Button kind="danger" on:click={goToPrevPage}>Anuluj</Button>
    <Button on:click={accept}>Zatwierdź</Button>
  </ButtonSet>
</div>

<style>
  .settings-page {
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }
  .settings {
    display: grid;
    grid-template-columns: 250px auto;
    grid-gap: 2rem;
  }
</style>
