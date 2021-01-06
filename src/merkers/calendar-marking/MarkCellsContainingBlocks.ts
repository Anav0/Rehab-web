import { CSSProperties } from "react";
import { CalendarCellData } from "../../models/calendarCellData";
import { ICalendarCellDataMarker } from "./index";
import { TimeBlock } from "../../models/timeBlock";

export class MarkCellsContainingBlocks implements ICalendarCellDataMarker {
  blocksId: Set<string> = new Set();
  style: CSSProperties = {};
  name: string;

  constructor(
    name: string,
    blocks: TimeBlock[] = [],
    style: CSSProperties = { border: "#f88944 solid 4px" }
  ) {
    this.name = name;
    this.style = style;

    for (let i = 0; i < blocks.length; i++) {
      this.blocksId.add(blocks[i].Id);
    }
  }

  getMarkerName(): string {
    return this.name;
  }
  mark(calendarCellData: CalendarCellData[]): void {
    console.log(this.blocksId);

    if (this.blocksId === undefined) return;
    for (let cellData of calendarCellData) {
      if (this.blocksId.has(cellData.timeBlock.Id)) {
        Object.assign(cellData.style, this.style);
      }
    }
  }
}
