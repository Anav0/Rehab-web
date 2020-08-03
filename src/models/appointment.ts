import { Patient } from "./patient";
import { Treatment } from "./treatment";

export class Appointment {
  id: string;
  patients: Patient[];
  treatment: Treatment;
  startDate: Date;

  get endDate(): Date {
    let tmp = new Date(this.startDate);
    tmp.setSeconds(tmp.getSeconds() + this.treatment.durationInSeconds);
    return tmp;
  }

  constructor(id: string,startDate: Date, treatment: Treatment, patients: Patient[]) {
    this.id = id;
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
