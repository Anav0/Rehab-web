import {
  AppointmentActionType,
  ADD_APPOINTMENT,
  REMOVE_APPOINTMENT,
  UPDATE_APPOINTMENT,
} from "./types";
import { Appointment } from "../../models/appointment";

export const addAppointment = (
  appointment: Appointment
): AppointmentActionType => {
  return {
    type: ADD_APPOINTMENT,
    payload: appointment,
  };
};

export const removeAppointment = (
  Appointment: Appointment
): AppointmentActionType => {
  return {
    type: REMOVE_APPOINTMENT,
    payload: Appointment,
  };
};

export const updateAppointment = (
  Appointment: Appointment
): AppointmentActionType => {
  return {
    type: UPDATE_APPOINTMENT,
    payload: Appointment,
  };
};
