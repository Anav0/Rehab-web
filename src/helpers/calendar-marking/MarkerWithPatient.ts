import {CSSProperties} from "react";
import {CalendarCellData} from "../../models/calendarCellData";
import {ICalendarCellDataMarker} from "./index";
import {Patient} from "../../models/patient";

export abstract class MarkerWithPatient implements ICalendarCellDataMarker {
    patient: Patient | undefined
    style: CSSProperties = {}
    name: string

    protected constructor(name: string, patient: Patient | undefined = undefined) {
        this.patient = patient;
        this.name = name;
    }

    getMarkerName(): string {
        return this.name;
    }

    public setPatient(patient: Patient | undefined) {
        this.patient = patient
    }

    abstract mark(calendarCellData: CalendarCellData[]): void;
}