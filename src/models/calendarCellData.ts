import {CSSProperties} from 'react';
import {TimeBlock} from './timeBlock';

export interface CalendarCellData {
    id: string,
    style: CSSProperties;
    timeBlock: TimeBlock;
    day: Date;
    timeStamp: string;
}
