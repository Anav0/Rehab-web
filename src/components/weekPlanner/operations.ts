import {formatKey} from "../../mock/timeBlocks";
import {TimeBlock} from "../../models/timeBlock";
import {CalendarCellData} from "../../models/calendarCellData";
import {copy} from "../../helpers";
import {sitesByDay} from "../../mock/sites";
import {defaultBlocksConfig} from "../../models/timeBlockConfig";
import {WeekPlannerProps} from "./index";
import {Uuid} from "../../helpers/uuid";

export const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const getHours = (startTime: string = "06:00", endTime: string = "20:00", interval: number) => {
    const timeConfig = {hour: '2-digit', minute: '2-digit'};
    const lang = 'pl';
    let hours: string[] = [];

    let splitStartHour = startTime.split(':');
    let splitEndHour = endTime.split(':');

    let changingDate = new Date();
    changingDate.setHours(+splitStartHour[0], +splitStartHour[1], 0);

    let referenceDate = new Date();
    referenceDate.setHours(+splitEndHour[0], +splitEndHour[1], 0);

    do {
        let newHour = changingDate.toLocaleTimeString(lang, timeConfig);
        changingDate.setTime(changingDate.getTime() + interval * 60000);
        hours.push(newHour);
    } while (changingDate.getTime() <= referenceDate.getTime());
    return hours;
};

export const getCorrespondingMonday = (date: Date) => {
    date = new Date(date);
    let day = date.getDay(),
        diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
};

export const getDaysOfWeekForDate = (date: Date) => {
    let days: Date[] = [];
    let monday = getCorrespondingMonday(date);
    for (let i = 0; i < 7; i++) {
        let tmp = new Date(monday);
        tmp.setDate(tmp.getDate() + i);
        days.push(tmp);
    }
    return days;
};

export const isTimeBlockAvailable = (
    timeBlock: TimeBlock, unavailableDates: any): boolean => {
    if (!unavailableDates) return true;
    for (let pair of unavailableDates) {
        let start = new Date(pair[0]);
        start.setHours(0, 0, 0, 0);
        let end = new Date(pair[1]);
        end.setHours(23, 0, 0, 0);
        if (timeBlock.StartDate.getTime() >= start.getTime() &&
            timeBlock.StartDate.getTime() <= end.getTime()) return false;
    }
    return true;
};

export const getCalendarCellsData = (
    hours: string[],
    days: Date[],
    props: WeekPlannerProps,
) => {
    let tmpCalendarCellData: CalendarCellData[] = [];
    let i = 0;
    let blocksByDay: {
        [key: string]: any;
    } = {};
    for (let element of props.timeBlocks) {
        let key = formatKey(element.StartDate);
        blocksByDay[key] = element;
    }
    for (let timeRange of hours) {
        let k = 0;
        for (let day of days) {
            let firstSplit = timeRange.split('-');
            let hours = firstSplit[0].split(':')[0];
            let minutes = firstSplit[0].split(':')[1];
            let tmpDate = new Date(day);
            tmpDate.setHours(+hours, +minutes, 0, 0);
            let key = formatKey(tmpDate);
            let sitesForGivenDay = copy(sitesByDay[tmpDate.getDay()]);
            tmpCalendarCellData.push({
                id: Uuid.uuidv4(),
                style: {
                    gridRow: `${k + 2}/${k + 3}`,
                    gridColumn: `${i + 2}/${i + 3}`,
                },
                timeBlock:
                    blocksByDay[key] != null
                        ? blocksByDay[key]
                        : new TimeBlock(
                        tmpDate,
                        defaultBlocksConfig.durationInMinutes,
                        sitesForGivenDay,
                        ),
                day,
                timeStamp: timeRange,
                isNew: blocksByDay[key] != null ? blocksByDay[key].IsNew : false,
                isBlocked: blocksByDay[key] != null ?
                    !isTimeBlockAvailable(blocksByDay[key], props.unavailableDates) :
                    false,
            });
            k++;
        }
        i++;
    }
    return tmpCalendarCellData;
};