import type { Patient } from "./patient";

export enum ReferralStatus {
  Done,
  ToDo,
  Deleted,
}

export class Referral {
  id: string;
  patient: Patient;
  date: Date;
  status: ReferralStatus;
  priority: string;
}
