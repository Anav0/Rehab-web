import { Patient } from "./patient";
import { Treatment } from "./treatment";

export class PatientWish {
  patient: Patient;
  treatment: Treatment;

  constructor(patient: Patient, treatment: Treatment) {
    this.patient = patient;
    this.treatment = treatment;
  }
}
