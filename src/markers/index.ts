import {CalendarCellData} from "../models/calendarCellData";

export interface ICalendarCellMarker {
    getMarkerName(): string
    mark(calendarCellData: CalendarCellData[]): void
}