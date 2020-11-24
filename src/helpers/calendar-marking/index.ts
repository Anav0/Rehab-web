import {CalendarCellData} from "../../models/calendarCellData";


export interface ICalendarCellDataMarker {
    getMarkerName(): string
    mark(calendarCellData: CalendarCellData[]): void
}