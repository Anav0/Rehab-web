import {Recommendation} from "./recommendation";
import {Patient} from "./patient";

export class Referral {
    Patient: Patient;
    Recommendations: Recommendation[]

    constructor(Patient: Patient, Recommendations: Recommendation[]) {
        this.Patient = Patient;
        this.Recommendations = Recommendations;
    }
}