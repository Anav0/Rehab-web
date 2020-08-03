import { Appointment } from "../models/appointment";
import patients from "./patients";
import treatments from "./treatments";

export default [
  new Appointment("0",new Date("July 28, 2020 07:00"), treatments[0], [
    patients[0],
    patients[1],
  ]),
  new Appointment("1",new Date("July 28, 2020 07:20"), treatments[3], [
    patients[0],
    patients[1],
  ]),
  new Appointment("2",new Date("July 28, 2020 07:00"), treatments[1], [
    patients[2],
    patients[3],
  ]),
  new Appointment("3",new Date("July 28, 2020 09:25"), treatments[2], [
    patients[2],
    patients[3],
  ]),
];
