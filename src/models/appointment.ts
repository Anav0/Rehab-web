import { Patient } from "./patient";
import { Treatment } from "./treatment";

export class Appointment {
  patients: Patient[];
  treatment: Treatment;
  startDate: Date;

  get endDate(): Date {
    let tmp = new Date(this.startDate);
    tmp.setSeconds(tmp.getSeconds() + this.treatment.durationInSeconds);
    return tmp;
  }

  constructor(startDate: Date, treatment: Treatment, patients: Patient[]) {
    this.startDate = startDate;
    this.treatment = treatment;
    this.patients = patients;
  }

  addPatient(patient: Patient) {
    this.patients.push(patient);
  }

  removePatient(patientId: string) {
    this.patients = this.patients.filter((x) => x.id !== patientId);
  }
}
