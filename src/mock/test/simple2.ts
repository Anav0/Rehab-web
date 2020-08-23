import { TreatmentSite } from "../../models/treatmentSite";
import { Appointment } from "../../models/appointment";
import treatments from "../treatments";
import patients from "../patients";
import { TimeBlock } from "../../models/timeBlock";

const sites = [
  new TreatmentSite(
    "0",
    "Sala gimnastyczna A",
    { "0": { "1": 2 } },
    { "0": 4, "1": 0 },
    []
  ),
  new TreatmentSite(
    "1",
    "Sala gimnastyczna B",
    { "0": { "1": 2 } },
    { "0": 2, "1": 4 },
    []
  ),
  new TreatmentSite("2", "Pokój masażu", {}, { "2": 1 }, [
    new Appointment(treatments[2], patients[0]),
  ]),
];

export const simpleCase2 = [
  new TimeBlock(new Date(2020, 7, 23, 12, 0, 0, 0), 3600, sites),
  new TimeBlock(new Date(2020, 7, 23, 7, 0, 0, 0), 3600, sites),
];
