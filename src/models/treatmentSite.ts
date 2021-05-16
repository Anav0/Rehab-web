import {Appointment} from "./appointment";
import {Sex} from "./patient";

export class TreatmentSite {
    Id: string;
    Name: string;
    Capacity: { [treatmentId: string]: number };
    VisitsScheduled: { [patientId: string]: Appointment };
    SexConstraintTreatments: string[];
    VisitesSpaceUsage: {
        [treatmentId: string]: { [treatmentId: string]: number };
    };
    readonly OriginalCapacitySum: number;
    SexOfFirstPaitent: Sex | undefined;

    constructor(
        id: string,
        name: string,
        blocageLookup: { [treatmentId: string]: { [treatmentId: string]: number } },
        capacity: { [treatmentId: string]: number },
        SexConstraintTreatments: string[],
        visitsScheduled: { [patientId: string]: Appointment },
    ) {
        this.Id = id;
        this.Name = name;
        this.VisitesSpaceUsage = blocageLookup;
        this.Capacity = capacity;
        this.OriginalCapacitySum = this.sumCapacity(capacity);
        this.SexConstraintTreatments = SexConstraintTreatments;
        this.VisitsScheduled = visitsScheduled;
    }

    private sumCapacity(capacity: any) {
        let value = 0;
        for (let property in capacity) {
            value += +capacity[property];
        }
        return value;
    }
}
