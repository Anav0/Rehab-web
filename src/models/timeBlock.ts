import { TreatmentSite } from "./treatmentSite";

export class TimeBlock {
  Id: string;
  StartDate: Date;
  DurationInMinutes: number;
  Sites: TreatmentSite[];

  constructor(
    id: string,
    start: Date,
    durationInMinutes: number = 60,
    sites: TreatmentSite[]
  ) {
    this.Id = id;
    this.StartDate = start;
    this.DurationInMinutes = durationInMinutes;
    this.Sites = sites;
  }

  get EndDate(): Date {
    let tmp = new Date(this.StartDate);
    tmp.setMinutes(tmp.getMinutes() + this.DurationInMinutes);
    return tmp;
  }
}
