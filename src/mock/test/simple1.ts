import { TreatmentSite } from "../../models/treatmentSite";
import { Appointment } from "../../models/appointment";
import treatments from "../treatments";
import patients from "../patients";
import { TimeBlock } from "../../models/timeBlock";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";

const sites = [
  new TreatmentSite(
    "0",
    "Sala gimnastyczna A",
    { "0": { "1": 2 } },
    { "0": 4, "1": 0 },
    [
      new Appointment(treatments[1], patients[1]),
      new Appointment(treatments[1], patients[2]),
      new Appointment(treatments[1], patients[3]),
      new Appointment(treatments[1], patients[4]),
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
    new Date(2020, 7, 23, 6, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    new Date(2020, 7, 23, 7, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    new Date(2020, 7, 23, 8, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    new Date(2020, 7, 23, 9, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    new Date(2020, 7, 23, 10, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    new Date(2020, 7, 23, 11, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    new Date(2020, 7, 23, 12, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    new Date(2020, 7, 23, 13, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    new Date(2020, 7, 23, 14, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    new Date(2020, 7, 23, 16, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
  new TimeBlock(
    new Date(2020, 7, 23, 17, 0, 0, 0),
    defaultBlocksConfig.duration,
    sites
  ),
];
