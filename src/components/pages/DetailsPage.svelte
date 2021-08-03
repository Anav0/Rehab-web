<script lang="ts">
  import Day from "../Day.svelte";
  import { SelectItem, Select, DatePicker, DatePickerInput } from "carbon-components-svelte";
  import type { Treatment } from "../../models/treatment";
  import { proposition, schedulingRequest } from "../../stores/scheduling";
  import { dateFormat } from "../../stores/date";
  import { onMount } from "svelte";
  import { api } from "../../api";
  import { getWorkdaysFromMondayOf } from "../../services/dates";
  import type { Term } from "../../models/term";
  import { DayModel, PlaceModel } from "../../models/calendar";

  let treatments: Treatment[] = [];
  let dates: Date[] = [];
  let startingPoint: Date = new Date(2021, 1, 1, 6, 0, 0);
  let isLoading = true;
  let dayModelByDayStr: Map<string, DayModel>;
  let hours: string[] = [];
  let hoveredTerm: Term = null;

  const buildHours = () => {
    const endTime = new Date(2000, 1, 1, 18, 0, 0);
    const currentTime = new Date(2000, 1, 1, 7, 0, 0);
    const interval = 60;
    const mult = 60000;
    let buildHours = [];

    let j = 0;
    do {
      currentTime.setTime(currentTime.getTime() + interval * mult);
      buildHours.push(
        currentTime.toLocaleString("pl", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      j++;
    } while (currentTime < endTime);

    return buildHours;
  };
  onMount(async () => {
    //$schedulingRequest.ReferralId = "1"; //"101715";
    //$schedulingRequest.Algorithm = "D";
    //const { data: result } = await api.scheduling.proposition($schedulingRequest);
    //$proposition = result;
    dates = getWorkdaysFromMondayOf(startingPoint, 10);
    hours = buildHours();
    let buildingMap = new Map();

    let termId = 1;
    let mult = 60000;
    for (let i = 0; i < dates.length; i++) {
      const dt = dates[i];
      dt.setHours(8, 0, 0);
      let endDate: Date;
      let endTime = new Date(dt);
      endTime.setHours(18, 0, 0);
      let places = ["Sala A", "MGS", "Komora"];
      let placesDur = [5, 10, 15];
      let buildHours: string[] = [];
      for (let p = 0; p < places.length; p++) {
        let blockDur = placesDur[p];
        let j = 0;
        do {
          let clonedDate = new Date(dt);
          clonedDate.setTime(clonedDate.getTime() + j * blockDur * mult);
          let startDate = new Date(clonedDate);
          clonedDate.setTime(clonedDate.getTime() + blockDur * mult);
          endDate = clonedDate;
          let term = {
            Id: termId,
            Capacity: 1,
            Used: 0,
            Duration: blockDur,
            StartDate: startDate,
            EndDate: endDate,
            TreatmentId: "0",
            PlaceId: null,
            PlaceName: places[p],
            TreatmentDuration: blockDur,
          };
          termId++;
          if (buildingMap.has(startDate.toDateString())) {
            let dayModel = buildingMap.get(startDate.toDateString());
            if (dayModel.placeModelsByPlaceName.has(term.PlaceName)) {
              let placeModel = dayModel.placeModelsByPlaceName.get(term.PlaceName);
              placeModel.terms.push(term);
            } else {
              let placeModel = new PlaceModel();
              placeModel.name = term.PlaceName;
              placeModel.terms.push(term);
              dayModel.placeModelsByPlaceName.set(term.PlaceName, placeModel);
            }
          } else {
            let dayModel = new DayModel();
            dayModel.date = term.StartDate;

            let placeModel = new PlaceModel();
            placeModel.name = term.PlaceName;
            placeModel.terms.push(term);

            dayModel.placeModelsByPlaceName.set(term.PlaceName, placeModel);
            buildingMap.set(startDate.toDateString(), dayModel);
          }
          j++;
        } while (endDate == null || endDate.getTime() < endTime.getTime());
      }
    }
    dayModelByDayStr = buildingMap;
    isLoading = false;
  });

  proposition.subscribe((value) => {
    if (value == null) return;

    //date = new Date(value.ProposedTrms[0][0].StartDate);
    //dates = getWorkdaysFromMondayOf(date, 10);
    //console.log(date);
  });

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
    return `${dateStr}, ${startTime} - ${endTime}, ${hoveredTerm.PlaceName}`;
  };
</script>

<div class="details-page page">
  {#if isLoading}
    <span>Loading</span>
  {:else}
    <div class="details-panel">
      <Select labelText="Zabieg" on:change={({ detail }) => {}}>
        {#each treatments as item}
          <SelectItem value={item.Id} text={item.Name} />
        {/each}
      </Select>
      <DatePicker value={startingPoint.toLocaleString("pl", $dateFormat)}>
        <DatePickerInput labelText="Data" placeholder="dd.mm.yyy" />
      </DatePicker>
      <span>{hoveredTerm ? printInfoAboutHovered() : "Nic"}</span>
    </div>
    <div class="details-hours" style="grid-template-columns: repeat({hours.length},1fr);">
      {#each hours as hour}
        <div>{hour}</div>
      {/each}
    </div>
    <div class="details-days">
      {#each [...dayModelByDayStr] as [dayStr, dayModel]}
        <Day {dayModel} on:termOver={({ detail: term }) => (hoveredTerm = term)} />
      {/each}
    </div>
  {/if}
</div>

<style>
  * {
    box-sizing: border-box;
  }
  .details-page {
    --details-gap: 2px;
    --details-bg: var(--cds-ui-03);
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    grid-template-rows: auto auto 1fr 1fr;
    grid-column: 1/4;
    grid-template-areas:
      "toolbar toolbar ."
      ". hours hours"
      "days days days"
      "days days days";
  }
  .details-panel {
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr auto;
    grid-gap: 2rem;
    grid-area: toolbar;
  }
  .details-days {
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: 1fr;
    grid-area: days;
    background-color: var(--details-bg);
    overflow: auto;
  }
  .details-hours {
    grid-area: hours;
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-rows: 1fr;
  }

  .details-days {
    grid-gap: var(--details-gap);
    padding: var(--details-gap) 0 var(--details-gap) var(--details-gap);
  }
</style>
