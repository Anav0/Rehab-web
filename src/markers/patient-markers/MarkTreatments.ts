import {Appointment} from "../../models/appointment";
import {CalendarCellData} from "../../models/calendarCellData";
import {Patient} from "../../models/patient";
import {PatientMarker} from "./PatientMarker";

export class MarkTreatments extends PatientMarker {
    treatmentsColors: Map<string, string>;

    constructor(
        name: string,
        patient: Patient | undefined,
        treatmentsColors: Map<string, string>,
    ) {
        super(name, patient);
        this.treatmentsColors = treatmentsColors;
    }

    getMarkerName(): string {
        return this.name;
    }

    mark(calendarCellData: CalendarCellData[]): void {
        if (this.patient === undefined) return;
        for (let cellData of calendarCellData) {
            for (const site of cellData.timeBlock.Sites) {
                if (site.VisitsScheduled.hasOwnProperty(this.patient.Id)) {
                    let appointment = site.VisitsScheduled[
                        this.patient.Id] as Appointment;
                    let colorInfo = this.treatmentsColors.get(appointment.TreatmentId);
                    this.style.border = `${colorInfo} solid 4px`;
                    Object.assign(cellData.style, this.style);
                }
            }
        }
    }
}
