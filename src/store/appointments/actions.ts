import {ADD_APPOINTMENT, AppointmentActionType, FILL_APPOINTMENTS, REMOVE_APPOINTMENT} from "./types";
import {Appointment} from "../../models/appointment";

export const addAppointment = (appointment: Appointment): AppointmentActionType => {
    return {
        type: ADD_APPOINTMENT,
        payload: appointment
    }
}

export const removeAppointment = (appointment: Appointment): AppointmentActionType => {
    return {
        type: REMOVE_APPOINTMENT,
        payload: appointment
    }
}

export const fillAppointments = (appointments: Appointment[]): AppointmentActionType => {
    return {
        type: FILL_APPOINTMENTS,
        payload: appointments
    }
}