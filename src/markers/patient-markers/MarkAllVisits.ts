import { CSSProperties } from "react";
import { CalendarCellData } from "../../models/calendarCellData";
import {PatientMarker} from "./PatientMarker";
import { Patient } from "../../models/patient";

export class MarkAllVisits extends PatientMarker {
  constructor(
    name: string,
    patient: Patient | undefined = undefined,
    style: CSSProperties = { border: "#f88944 solid 4px" }
  ) {
    super(name, patient);
    this.style = style;
  }

  getMarkerName(): string {
    return this.name;
  }

  mark(calendarCellData: CalendarCellData[]): void {
    if (this.patient === undefined) return;

    for (let cellData of calendarCellData) {
      for (const site of cellData.timeBlock.Sites) {
        if (site.VisitsScheduled.hasOwnProperty(this.patient.Id)) {
          Object.assign(cellData.style, this.style);
        }
      }
    }
  }
}
