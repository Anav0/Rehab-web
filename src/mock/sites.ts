import { TreatmentSite } from "../models/treatmentSite";

function newSites() {
  return [
    new TreatmentSite(
      "0",
      "Sala gimnastyczna A",
      {},
      { "0": 2, "1": 4, "6": 2, "8": 2, "9": 2, "10": 2 },
      []
    ),
    new TreatmentSite("2", "Pokój masażu", {}, { "2": 1, "5": 1 }, []),
    new TreatmentSite("3", "Kriokomora", {}, { "4": 1 }, []),
    new TreatmentSite("4", "Pokój z laserem", {}, { "3": 2 }, []),
    new TreatmentSite(
      "5",
      "Wiekszy pokój masażu",
      {},
      { "2": 2, "5": 2 },
      [],
      ["2", "5"]
      
    ),
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
