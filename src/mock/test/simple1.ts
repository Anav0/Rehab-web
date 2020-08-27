import { TreatmentSite } from "../../models/treatmentSite";
import { Appointment } from "../../models/appointment";
import treatments from "../treatments";
import patients from "../patients";
import { TimeBlock } from "../../models/timeBlock";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";
import { setDatesTime } from "../timeBlocks";

const sites = [
  new TreatmentSite(
    "0",
    "Sala gimnastyczna A",
    { "0": { "1": 2 } },
    { "0": 4, "1": 0 },
    [
      new Appointment(treatments[1], patients[1]),
      new Appointment(treatments[1], patients[2]),
    ]
  ),
  new TreatmentSite(
    "1",
    "Sala gimnastyczna B",
    { "0": { "1": 2 } },
    { "0": 2, "1": 4 },
    []
  ),
  new TreatmentSite("2", "Pokój masażu", {}, { "2": 1 }, []),
];

let date = new Date(2020, 7, 31);

export const simpleCase1 = [
  new TimeBlock(
    setDatesTime(6, 0, 0, 0, date),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    setDatesTime(7, 0, 0, 0, date),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    setDatesTime(8, 0, 0, 0, date),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    setDatesTime(9, 0, 0, 0, date),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    setDatesTime(10, 0, 0, 0, date),
    defaultBlocksConfig.duration,
    sites
  ),
];
