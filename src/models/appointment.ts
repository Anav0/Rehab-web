import { Patient } from "./patient";
import { Treatment } from "./treatment";
import { Uuid } from "../helpers";

export class Appointment {
  Id: string;
  Patient: Patient;
  Treatment: Treatment;

  constructor(treatment: Treatment, patient: Patient) {
    this.Id = Uuid.uuidv4();
    this.Patient = patient;
    this.Treatment = treatment;
  }
}
