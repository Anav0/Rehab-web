import {CalendarCellData} from "../../models/calendarCellData";
import {Treatment} from "../../models/treatment";
import {Patient} from "../../models/patient";
import {MarkerWithPatient} from "./MarkerWithPatient";

export class TreatmentMarker extends MarkerWithPatient {
    procedures: Treatment[]
    proceduresColors: string[]

    constructor(name: string, patient: Patient, procedures: Treatment[], proceduresColors: string[]) {
        super(name, patient)
        this.procedures = procedures
        this.proceduresColors = proceduresColors
    }

    getMarkerName(): string {
        return this.name;
    }

    mark(calendarCellData: CalendarCellData[]): void {
        for (let cellData of calendarCellData) {
            cellData.timeBlock.Sites.some(x => x.Appointments.some(appointment => this.procedures.some(procedure => {
                if (!this.patient) throw new Error("Patient is undefined")
                let matches = procedure.Id === appointment.TreatmentId && appointment.Patient.Id === this.patient.Id;
                if (matches) {
                    this.style.border = `${this.proceduresColors[this.procedures.indexOf(procedure)]} solid 4px`
                    Object.assign(cellData.style, this.style)
                }
            })))
        }
    }
}