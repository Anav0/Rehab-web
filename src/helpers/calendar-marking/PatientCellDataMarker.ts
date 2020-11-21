import {Patient} from "../../models/patient";
import {CSSProperties} from "react";
import {CalendarCellData} from "../../models/calendarCellData";
import {ICalendarCellDataMarker} from "./index";

export class PatientCellDataMarker implements ICalendarCellDataMarker {
    patient: Patient | undefined
    style: CSSProperties = {}
    name: string

    constructor(name: string, style: CSSProperties = {border: "#f88944 solid 4px"}) {
        this.name = name;
        this.style = style;
    }

    setPatient(patient: Patient) {
        this.patient = patient
    }

    getMarkerName(): string {
        return this.name;
    }

    mark(calendarCellData: CalendarCellData[]): void {
        for (let cellData of calendarCellData) {
            cellData.timeBlock.Sites.some(site => site.Appointments.some(appointment => {
                if (this.patient === undefined) throw new Error("Patient is undefined")
                let isPatientIncluded = this.patient.Id === appointment.Patient.Id;
                if (isPatientIncluded)
                    Object.assign(cellData.style, this.style);
                return isPatientIncluded;
            }))
        }
    }
}