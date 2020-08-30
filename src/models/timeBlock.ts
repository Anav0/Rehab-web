import { TreatmentSite } from "./treatmentSite";

export class TimeBlock {
  startDate: Date;
  durationInMinutes: number;
  sites: TreatmentSite[];

  constructor(
    start: Date,
    durationInMinutes: number = 60,
    sites: TreatmentSite[]
  ) {
    this.startDate = start;
    this.durationInMinutes = durationInMinutes;
    this.sites = sites;
  }

  get end(): Date {
    let tmp = new Date(this.startDate);
    tmp.setMinutes(tmp.getMinutes() + this.durationInMinutes);
    return tmp;
  }
}
