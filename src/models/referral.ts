import type { Patient } from "./patient";
import type { Status } from "./status";

export class Referral {
  id: string;
  patient: Patient;
  date: Date;
  status: Status;
  priority: string;
}
