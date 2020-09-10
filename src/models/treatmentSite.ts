import {Appointment} from "./appointment";

export class TreatmentSite {
    public Id: string;
    public Name: string;
    public BlocageLookup: any;
    public Capacity: any;
    public readonly  OriginalCapacitySum: number
    public Appointments: Appointment[];

    constructor(
        id: string,
        name: string,
        blocageLookup: object,
        capacity: object,
        appointments: Appointment[]
    ) {
        this.Id = id;
        this.Name = name;
        this.BlocageLookup = blocageLookup;
        this.Capacity = capacity;
        this.OriginalCapacitySum = this.sumCapacity(capacity)
        this.Appointments = appointments;
    }

    private sumCapacity(capacity: any){
        let value = 0;
        for (let property in capacity) {
            value += +capacity[property]
        }
        return value;
    }

    tryAddingAppointment(appointment: Appointment): boolean {
        if (!(appointment.Treatment.Id in this.Capacity)) return false;
        if (this.Capacity[appointment.Treatment.Id] <= 0) return false;

        this.Capacity[appointment.Treatment.Id]--;
        this.Appointments.push(appointment);

        if (appointment.Treatment.Id in this.BlocageLookup) {
            let treatmentBlocage = this.BlocageLookup[appointment.Treatment.Id];
            for (let pair of treatmentBlocage) {
                this.Capacity[pair.Key] -= pair.Value;
            }
        }

        return true;
    }
}
