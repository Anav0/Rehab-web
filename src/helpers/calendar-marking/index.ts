import {CalendarCellData} from "../../models/calendarCellData";


export interface ICalendarCellDataMarker {
    mark(calendarCellData: CalendarCellData[]): void
}