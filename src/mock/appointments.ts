import { Appointment } from "../models/appointment";
import patients from "./patients";
import treatments from "./treatments";

export default [
  new Appointment(new Date("July 29, 2020 07:00"), treatments[0], [
    patients[0],
    patients[1],
  ]),
  new Appointment(new Date("July 29, 2020 07:20"), treatments[3], [
    patients[0],
    patients[1],
  ]),
  new Appointment(new Date("July 29, 2020 07:00"), treatments[1], [
    patients[2],
    patients[3],
  ]),
  new Appointment(new Date("July 29, 2020 09:25"), treatments[2], [
    patients[2],
    patients[3],
  ]),
];
