import { Uuid } from "../helpers/uuid";
import { Sex } from "./patient";

export class Appointment {
  Id: string;
  PatientId: string;
  PatientSex: Sex;
  TreatmentId: string;

  constructor(treatmentId: string, patientId: string, paitentSex: Sex) {
    this.Id = Uuid.uuidv4();
    this.PatientId = patientId;
    this.TreatmentId = treatmentId;
    this.PatientSex = paitentSex;
  }
}
