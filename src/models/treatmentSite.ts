import {Appointment} from './appointment';

export class TreatmentSite {
    Id: string;
    Name: string;
    BlocageLookup: { [treatmentId: string]: { [treatmentId: string]: number } };
    Capacity: { [treatmentId: string]: number };
    readonly OriginalCapacitySum: number;
    Appointments: Appointment[];
    SexConstraintTreatments: string[];

    constructor(
        id: string,
        name: string,
        blocageLookup: { [treatmentId: string]: { [treatmentId: string]: number } },
        capacity: { [treatmentId: string]: number },
        appointments: Appointment[],
        SexConstraintTreatments: string[] = [],
    ) {
        this.Id = id;
        this.Name = name;
        this.BlocageLookup = blocageLookup;
        this.Capacity = capacity;
        this.OriginalCapacitySum = this.sumCapacity(capacity);
        this.Appointments = appointments;
        this.SexConstraintTreatments = SexConstraintTreatments;
    }

    tryAddingAppointment(appointment: Appointment): boolean {
        if (!(appointment.TreatmentId in this.Capacity)) return false;
        if (this.Capacity[appointment.TreatmentId] <= 0) return false;

        if (
            this.SexConstraintTreatments.includes(appointment.TreatmentId) &&
            this.Appointments.length > 0
        ) {
            let sexofFirstPatient = this.Appointments[0].Patient.Sex;
            if (appointment.Patient.Sex !== sexofFirstPatient) return false;
        }

        this.Capacity[appointment.TreatmentId]--;
        this.Appointments.push(appointment);

        if (appointment.TreatmentId in this.BlocageLookup) {
            let treatmentBlocage = this.BlocageLookup[appointment.TreatmentId];
            for (let key in treatmentBlocage) {
                this.Capacity[key] -= treatmentBlocage[key];
            }
        }

        return true;
    }

    private sumCapacity(capacity: any) {
        let value = 0;
        for (let property in capacity) {
            value += +capacity[property];
        }
        return value;
    }
}
