import { Appointment } from "../models/appointment";
import patients from "./patients";
import treatments from "./treatments";

export default [
  new Appointment(new Date("July 28, 2020 07:00"), treatments[1], [
    patients[0],
    patients[1],
    patients[2],
    patients[3],
  ]),
    new Appointment(new Date("July 28, 2020 07:00"), treatments[0], [
    patients[4],
    patients[5],
    patients[6],
    patients[7],
    patients[16],
    patients[17],
  ]),

  new Appointment(new Date("July 28, 2020 07:30"), treatments[2], [
    patients[8],
    patients[9],
  ]),
  new Appointment(new Date("July 28, 2020 08:00"), treatments[3], [
    patients[10],
    patients[11],
  ]),
  new Appointment(new Date("July 28, 2020 08:05"), treatments[1], [
    patients[12],
    patients[13],
  ]),
  new Appointment(new Date("July 28, 2020 12:00"), treatments[3], [
    patients[14],
    patients[15],
  ]),
];
