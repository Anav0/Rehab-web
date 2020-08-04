import {Patient} from "./patient";
import {Treatment} from "./treatment";

export class PatientWish {
    patient: Patient
    treatment: Treatment
    treatmentConstraints: any[]

    constructor(patient: Patient, treatment: Treatment, treatmentConstraints: any[]) {
        this.patient = patient;
        this.treatment = treatment;
        this.treatmentConstraints = treatmentConstraints;
    }
}