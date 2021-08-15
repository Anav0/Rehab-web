export class Referral {
  id: string;
  Id: string;
  Surname: string;
  FirstName: string;
  PatientId: string;
  Date: Date;
  Status: number;
  TreatmentName: string;
  TreatmentId: string;
}
export class SubReferral {
  Id: number;
  ParentId: number;
  TreatmentName: string;
  Level: number;
  Type: number;
}