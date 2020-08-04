import { Patient } from "./patient";
import { Treatment } from "./treatment";
import {BaseConstraint} from "./constraints/baseConstraint";

export class Appointment {
  patients: Patient[];
  treatment: Treatment;
  startDate: Date;
  constraints: BaseConstraint[]

  get endDate(): Date {
    let tmp = new Date(this.startDate);
    tmp.setSeconds(tmp.getSeconds() + this.treatment.durationInSeconds);
    return tmp;
  }

  constructor(startDate: Date, treatment: Treatment, patients: Patient[],  constraints: BaseConstraint[] = []) {
    this.patients = patients;
    this.treatment = treatment;
    this.startDate = startDate;
    this.constraints = constraints;
  }

  addPatient(patient: Patient) {
    this.patients.push(patient);
  }

  removePatient(patientId: string) {
    this.patients = this.patients.filter((x) => x.id !== patientId);
  }
}
