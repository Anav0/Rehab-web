import {CalendarCellData} from "../../models/calendarCellData";
import {Patient} from "../../models/patient";
import {CSSProperties} from "react";
import {copy} from "../index";

export interface ICalendarCellDataFilter {
    filter(calendarCellData: CalendarCellData[]): void
}

const getRandomHexColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export class PatientsCellDataFilter implements ICalendarCellDataFilter {
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

    filter(calendarCellData: CalendarCellData[]): void {
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