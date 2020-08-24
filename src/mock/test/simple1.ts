import { TreatmentSite } from "../../models/treatmentSite";
import { Appointment } from "../../models/appointment";
import treatments from "../treatments";
import patients from "../patients";
import { TimeBlock } from "../../models/timeBlock";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";
import { getCurrentDateWithTime as getDateWithTime } from "../timeBlocks";

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

export const simpleCase1 = [
  new TimeBlock(
    getDateWithTime(6, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    getDateWithTime(7, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    getDateWithTime(8, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    getDateWithTime(9, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    getDateWithTime(10, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
];
