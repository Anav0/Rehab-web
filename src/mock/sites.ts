import { TreatmentSite } from "../models/treatmentSite";
import { Appointment } from "../models/appointment";
import treatments from "./treatments";
import patients from "./patients";

function newSites() {
  return [
    new TreatmentSite(
      "0",
      "Sala gimnastyczna A",
      { "0": { "1": 2 } },
      { "0": 4, "1": 8 },
      []
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
}

export const emptySites = newSites();
