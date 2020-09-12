import { TreatmentSite } from "./treatmentSite";

export class TimeBlock {
  StartDate: Date;
  DurationInMinutes: number;
  Sites: TreatmentSite[];
  IsNew: boolean = false;

  constructor(
    start: Date,
    durationInMinutes: number = 60,
    sites: TreatmentSite[]
  ) {
    this.StartDate = start;
    this.DurationInMinutes = durationInMinutes;
    this.Sites = sites;
  }

  get end(): Date {
    let tmp = new Date(this.StartDate);
    tmp.setMinutes(tmp.getMinutes() + this.DurationInMinutes);
    return tmp;
  }
}
