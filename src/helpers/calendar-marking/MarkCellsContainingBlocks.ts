import {CSSProperties} from "react";
import {CalendarCellData} from "../../models/calendarCellData";
import {ICalendarCellDataMarker} from "./index";
import {TimeBlock} from "../../models/timeBlock";

export class MarkCellsContainingBlocks implements ICalendarCellDataMarker {
    blocks: TimeBlock[] | undefined
    style: CSSProperties = {}
    name: string;

    constructor(name: string, blocks: TimeBlock[] = [], style: CSSProperties = {border: "#f88944 solid 4px"}) {
        this.name = name;
        this.blocks = blocks;
        this.style = style;
    }

    setCellIds(blocks: TimeBlock[]) {
        this.blocks = blocks
    }

    getMarkerName(): string {
        return this.name
    }

    mark(calendarCellData: CalendarCellData[]): void {
        if (this.blocks === undefined) return;
        for (let cellData of calendarCellData) {
            if (this.blocks.includes(cellData.timeBlock))
                Object.assign(cellData.style, this.style);
        }
    }
}