import { TreatmentSite } from "../models/treatmentSite";
import {defaultBlocksConfig} from "../models/timeBlockConfig";

function newSites() {
  return [
    new TreatmentSite(
      "0",
      "Sala gimnastyczna A",
      { },
      { "0": 2 * defaultBlocksConfig.durationInMinutes, "1": 4 * defaultBlocksConfig.durationInMinutes },
      []
    ),
    new TreatmentSite("2", "Pokój masażu", {}, { "2": defaultBlocksConfig.durationInMinutes }, []),
  ];
}

function newSites2() {
  return [
    new TreatmentSite(
      "0",
      "Sala gimnastyczna B",
      { },
      { "0": 2 * defaultBlocksConfig.durationInMinutes, "1": defaultBlocksConfig.durationInMinutes },
      []
    ),
    new TreatmentSite("2", "Pokój masażu", {}, { "2": defaultBlocksConfig.durationInMinutes }, []),
  ];
}

export const sitesByDay: TreatmentSite[][] = [
  newSites(),
  newSites2(),
  newSites(),
  newSites2(),
  newSites(),
  newSites2(),
  newSites(),
];
