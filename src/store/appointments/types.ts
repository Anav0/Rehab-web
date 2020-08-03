import {Appointment} from "../../models/appointment";

export const ADD_APPOINTMENT = 'ADD_APPOINTMENT'
export const REMOVE_APPOINTMENT = 'REMOVE_APPOINTMENT'
export const FILL_APPOINTMENTS = 'FILL_APPOINTMENTS'

interface FillAppointmentAction {
    type: typeof FILL_APPOINTMENTS,
    payload: Appointment[]
}

interface AddAppointmentAction{
    type: typeof ADD_APPOINTMENT,
    payload: Appointment
}

interface RemoveAppointmentAction{
    type: typeof REMOVE_APPOINTMENT,
    payload: Appointment
}

export interface AppointmentState {
    appointments: Appointment[]
}

export type AppointmentActionType = AddAppointmentAction | RemoveAppointmentAction | FillAppointmentAction