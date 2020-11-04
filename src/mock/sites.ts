import { TreatmentSite } from "../models/treatmentSite";
import { Sex } from "../models/patient";

function newSites() {
  return [
    new TreatmentSite(
      "0",
      "Sala gimnastyczna A",
      {},
      { "0": 2, "1": 4, "6": 2, "8": 2, "9": 2, "10": 2 },
      [],
      {}
    ),
    new TreatmentSite("2", "Pokój masażu", {}, { "2": 1, "5": 1 }, []),
    new TreatmentSite("3", "Kriokomora", {}, { "4": 1 }, []),
    new TreatmentSite("4", "Pokój z laserem", {}, { "3": 2 }, []),
    new TreatmentSite(
      "5",
      "Pokój masażu tylko dla kobiet",
      {},
      { "2": 1, "5": 1 },
      [],
      { "2": Sex.FEMALE, "5": Sex.FEMALE }
    ),
  ];
}

function newSites2() {
  return [
    new TreatmentSite("0", "Sala gimnastyczna B", {}, { "0": 2, "1": 1 }, []),
  ];
}

export const sitesByDay: TreatmentSite[][] = [
  newSites(),
  newSites(),
  newSites(),
  newSites(),
  newSites(),
  newSites(),
  newSites(),
];
