import { Appointment } from "../models/appointment";
import treatments from "./treatments";
import patients from "./patients";

export const existingAppointments = [
  new Appointment(treatments[0].Id, patients[0]),
];
