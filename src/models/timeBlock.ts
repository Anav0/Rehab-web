import { TreatmentSite } from "./treatmentSite";
import { Uuid } from "../helpers/uuid";

export class TimeBlock {
  Id: string;
  StartDate: Date;
  DurationInMinutes: number;
  Sites: TreatmentSite[];
  IsNew: boolean = false;

  constructor(
    start: Date,
    durationInMinutes: number = 60,
    sites: TreatmentSite[]
  ) {
    this.Id = Uuid.uuidv4();
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
