import {Patient} from "../../models/patient";
import {CSSProperties} from "react";
import {copy, getRandomHexColor} from "../index";
import {CalendarCellData} from "../../models/calendarCellData";
import {ICalendarCellDataMarker} from "./index";

export class PatientsCellDataMarker implements ICalendarCellDataMarker {
    patients: Patient[]
    patientStyles: { [patientId: string]: CSSProperties } = {}

    constructor(patients: Patient[]) {
        this.patients = patients;
        this.generateColorForPatients()
    }

    private generateColorForPatients() {
        let baseStyle: CSSProperties = {}
        for (let patient of this.patients) {
            let style = copy(baseStyle);
            style.backgroundColor = getRandomHexColor()
            this.patientStyles[patient.Id] = style;
        }
    }

    mark(calendarCellData: CalendarCellData[]): void {
        for (let cellData of calendarCellData) {
            cellData.timeBlock.Sites.some(site => site.Appointments.some(appointment => {
                let isPatientIncluded = this.patients.includes(appointment.Patient);
                if (isPatientIncluded)
                    cellData.style = this.patientStyles[appointment.Patient.Id];
                return isPatientIncluded;
            }))
        }
    }
}