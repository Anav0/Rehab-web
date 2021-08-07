<script lang="ts">
  import "flatpickr/dist/l10n/pl.js";
  import { DatePicker, DatePickerInput, Select, SelectItem, Button } from "carbon-components-svelte";
  import { Reset16 } from "carbon-icons-svelte";

  import type { Treatment } from "@/models/treatment";
  import type { Term } from "@/models/term";
  import { proposition, schedulingRequest } from "@/stores/scheduling";
  import { errMsg, errTitle } from "@/stores/error";
  import { api } from "@/api";

  export let treatments: Treatment[];
  export let selectedTreatmentId: string;
  export let selectedDate: number;
  export let hoveredTerm: Term;
  export let isLoading: boolean;

  const printInfoAboutHovered = () => {
    var dateStr = hoveredTerm.StartDate.toLocaleDateString("pl");
    var startTime = hoveredTerm.StartDate.toLocaleTimeString("pl", {
      hour: "2-digit",
      minute: "2-digit",
    });
    var endTime = hoveredTerm.EndDate.toLocaleTimeString("pl", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr}, ${startTime} - ${endTime}, ${hoveredTerm.PlaceName}, ${hoveredTerm.Id}, ${hoveredTerm.Used}/${hoveredTerm.Capacity}`;
  };

  let askForProposition = async () => {
    isLoading = true;
    try {
      const { data: result } = await api.scheduling.proposition($schedulingRequest);
      $proposition = result;
    } catch (err) {
      if (err.response) {
        $errTitle = "Błąd przy wyznaczaniu terminów";
        $errMsg = err.message;
        if (!err.response) {
          $errMsg = err.response.data.error;
        }
        console.error(err);
      }
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="details-panel">
  <div style="display:grid; grid-template-columns: auto 1fr;">
    <Select labelText="Zabieg" bind:selected={selectedTreatmentId}>
      {#each treatments as item}
        <SelectItem value={item.Id} text={item.Name} />
      {/each}
    </Select>
    <DatePicker
      dateFormat="d.m.Y"
      locale="pl"
      datePickerType="single"
      style="margin-left: 2rem"
      value={selectedDate}
      on:change={({ detail }) => (selectedDate = detail.selectedDates[0].getTime())}
    >
      <DatePickerInput labelText="Data" placeholder="dd.mm.yyy" />
    </DatePicker>
  </div>
  <span>{hoveredTerm ? printInfoAboutHovered() : ""}</span>
</div>
<div class="details-action">
  <Button kind="ghost" on:click={askForProposition} iconDescription="Wyznacz ponownie" icon={Reset16} />
  <Button kind="primary">Akceptuj</Button>
</div>
