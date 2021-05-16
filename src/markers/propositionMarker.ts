import {CalendarCellData} from "../models/calendarCellData";
import {Proposition} from "../models/Proposition";
import {ICalendarCellMarker} from "./index";

export class PropositionMarker implements ICalendarCellMarker{

    proposition: Proposition

    constructor(propositions: Proposition) {
        this.proposition = propositions;
    }

    getMarkerName(): string {
        return typeof(PropositionMarker);
    }

    mark(calendarCellData: CalendarCellData[]): void {

        let datesPointingToFriends: Map<number, number[]> = new Map();
        for (let dates of this.proposition.ScheduledDates) {
            for (let date of dates) {
                datesPointingToFriends.set(date, dates);
            }
        }
        for (let cell of calendarCellData){
            if(datesPointingToFriends.has(+cell.timeBlock.StartDate))
                cell.style = { border: "#44a1f8 solid 4px" };
        }
    }
}