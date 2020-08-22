import { TreatmentSite } from "./treatmentSite";

export class TimeBlock {
  start: Date;
  durationInSeconds: number;
  sites: TreatmentSite[];

  constructor(
    start: Date,
    durationInSeconds: number = 3600,
    sites: TreatmentSite[]
  ) {
    this.start = start;
    this.durationInSeconds = durationInSeconds;
    this.sites = sites;
  }

  get end(): Date {
    let tmp = new Date(this.start);
    tmp.setSeconds(tmp.getSeconds() + this.durationInSeconds);
    return tmp;
  }
}
