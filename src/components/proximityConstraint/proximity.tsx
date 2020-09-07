import {Treatment} from "../../models/treatment";

export interface Proximity {
    sign: number;
    offset: number;
    treatment: Treatment;
    treatmentIndex: number;
}