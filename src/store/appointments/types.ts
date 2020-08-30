import { Appointment } from "../../models/appointment";

export const ADD_APPOINTMENT = "ADD_APPOINTMENT";
export const REMOVE_APPOINTMENT = "REMOVE_APPOINTMENT";
export const UPDATE_APPOINTMENT = "UPDATE_APPOINTMENT";

interface AddAppointmentAction {
  type: typeof ADD_APPOINTMENT;
  payload: Appointment;
}

interface UpdateAppointmentAction {
  type: typeof UPDATE_APPOINTMENT;
  payload: Appointment;
}

interface RemoveAppointmentAction {
  type: typeof REMOVE_APPOINTMENT;
  payload: Appointment;
}

export interface AppointmentState {
  appointments: Appointment[];
}

export type AppointmentActionType =
  | AddAppointmentAction
  | UpdateAppointmentAction
  | RemoveAppointmentAction;
