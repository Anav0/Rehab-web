import {Appointment} from "./appointment";
import {PatientWish} from "./patientWish";

export class ApiPayload{
    startSearch: string
    endSearch: string
    existingAppointments: Appointment[]
    appointmentConstraints: any[]
    preferences: any[]
    patientWish: PatientWish

    constructor(startSearch: string, endSearch: string, existingAppointments: Appointment[], appointmentConstraints: any[], preferences: any[], patientWish: PatientWish) {
        this.startSearch = startSearch;
        this.endSearch = endSearch;
        this.existingAppointments = existingAppointments;
        this.appointmentConstraints = appointmentConstraints;
        this.preferences = preferences;
        this.patientWish = patientWish;
    }
}