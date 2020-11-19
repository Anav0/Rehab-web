import {Uuid} from '../helpers/uuid';
import {Patient} from './patient';

export class Appointment {
    Id: string;
    Patient: Patient;
    TreatmentId: string;

    constructor(treatmentId: string, patient: Patient) {
        this.Id = Uuid.uuidv4();
        this.Patient = patient;
        this.TreatmentId = treatmentId;
    }
}
