import { CSSProperties } from "react";
import { CalendarCellData } from "../../models/calendarCellData";
import { ICalendarCellDataMarker } from "./index";
import { TimeBlock } from "../../models/timeBlock";

export class MarkCellsContainingBlocks implements ICalendarCellDataMarker {
  blocks: TimeBlock[] | undefined; //TODO: change to simple "Set"
  style: CSSProperties = {};
  name: string;

  constructor(
    name: string,
    blocks: TimeBlock[] = [],
    style: CSSProperties = { border: "#f88944 solid 4px" }
  ) {
    this.name = name;
    this.style = style;
    this.blocks = blocks;
  }

  getMarkerName(): string {
    return this.name;
  }
  //TODO: change this to Set and id not date you peasent
  mark(calendarCellData: CalendarCellData[]): void {
    if (this.blocks === undefined) return;
    for (let cellData of calendarCellData) {
      if (
        this.blocks.find(
          (x) =>
            x.StartDate.getTime() === cellData.timeBlock.StartDate.getTime()
        )
      ) {
        Object.assign(cellData.style, this.style);
      }
    }
  }
}
