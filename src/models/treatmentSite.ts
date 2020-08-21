import { Appointment } from "./appointment";

export class TreatmentSite {
  public id: string;
  public name: string;
  public blocageLookup: any;
  public capacity: any;
  public appointments: Appointment[];

  constructor(
    id: string,
    name: string,
    blocageLookup: object,
    capacity: object,
    appointments: Appointment[]
  ) {
    this.id = id;
    this.name = name;
    this.blocageLookup = blocageLookup;
    this.capacity = capacity;
    this.appointments = appointments;
  }

  tryAddingAppointment(appointment: Appointment): boolean {
    if (!(appointment.treatment.id in this.capacity)) return false;
    if (this.capacity[appointment.treatment.id] <= 0) return false;

    this.capacity[appointment.treatment.id]--;
    this.appointments.push(appointment);

    if (appointment.treatment.id in this.blocageLookup) {
      var treatmentBlocage = this.blocageLookup[appointment.treatment.id];
      for (let pair of treatmentBlocage) {
        this.capacity[pair.Key] -= pair.Value;
      }
    }

    return true;
  }
}
