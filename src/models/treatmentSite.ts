import {Appointment} from "./appointment";
import {Sex} from "./patient";

export class TreatmentSite {
    Id: string;
    Name: string;
    BlocageLookup: any;
    Capacity: any;
    readonly OriginalCapacitySum: number
    Appointments: Appointment[];
    SexConstraintTreatments: {[key: string]: Sex};

    constructor(
        id: string,
        name: string,
        blocageLookup: object,
        capacity: object,
        appointments: Appointment[],
        SexConstraintTreatments = {}
    ) {
        this.Id = id;
        this.Name = name;
        this.BlocageLookup = blocageLookup;
        this.Capacity = capacity;
        this.OriginalCapacitySum = this.sumCapacity(capacity)
        this.Appointments = appointments;
        this.SexConstraintTreatments = SexConstraintTreatments;
    }

    private sumCapacity(capacity: any) {
        let value = 0;
        for (let property in capacity) {
            value += +capacity[property]
        }
        return value;
    }

    tryAddingAppointment(appointment: Appointment): boolean {
        if (!(appointment.TreatmentId in this.Capacity)) return false;
        if (this.Capacity[appointment.TreatmentId] <= 0) return false;

        this.Capacity[appointment.TreatmentId]--;
        this.Appointments.push(appointment);

        if (appointment.TreatmentId in this.BlocageLookup) {
            let treatmentBlocage = this.BlocageLookup[appointment.TreatmentId];
            for (let pair of treatmentBlocage) {
                this.Capacity[pair.Key] -= pair.Value;
            }
        }

        return true;
    }
}
