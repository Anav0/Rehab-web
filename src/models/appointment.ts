import { Patient } from "./patient";
import { Treatment } from "./treatment";
import { Uuid } from "../helpers";

export class Appointment {
  id: string;
  patient: Patient;
  treatment: Treatment;

  constructor(treatment: Treatment, patient: Patient) {
    this.id = Uuid.uuidv4();
    this.patient = patient;
    this.treatment = treatment;
  }
}
