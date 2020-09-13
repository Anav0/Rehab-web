import { CSSProperties } from "react";
import { TimeBlock } from "./timeBlock";

export interface CalendarCellData {
  style: CSSProperties;
  timeBlock: TimeBlock;
  day: Date;
  timeStamp: string;
  isNew: boolean;
  isBlocked: boolean;
}
