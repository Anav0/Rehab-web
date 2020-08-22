import { TreatmentSite } from "./treatmentSite";
import { emptySites } from "../mock/sites";

export class TimeBlocksConfig {
  duration: number = 3600;
  defaultSites: TreatmentSite[] = emptySites;
  startHour: string = "6:00";
  endHour: string = "20:00";
  endSearchAfterDays: number = 365 / 4;
}

export const defaultBlocksConfig = new TimeBlocksConfig();
