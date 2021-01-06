import {CSSProperties} from "react";
import {CalendarCellData} from "../../../models/calendarCellData";
import {MarkerWithPatient} from "./MarkerWithPatient";
import {Patient} from "../../../models/patient";

export class PatientMarker extends MarkerWithPatient {

    constructor(name: string, patient: Patient | undefined = undefined, style: CSSProperties = {border: "#f88944 solid 4px"}) {
        super(name, patient)
        this.style = style;
    }

    getMarkerName(): string {
        return this.name;
    }

    mark(calendarCellData: CalendarCellData[]): void {
        for (let cellData of calendarCellData) {
            cellData.timeBlock.Sites.some(site => site.Appointments.some(appointment => {
                if (this.patient === undefined) return false
                let isPatientIncluded = this.patient.Id === appointment.Patient.Id;
                if (isPatientIncluded)
                    Object.assign(cellData.style, this.style);
                return isPatientIncluded;
            }))
        }
    }
}