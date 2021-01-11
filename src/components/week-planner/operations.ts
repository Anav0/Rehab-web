import { CalendarCellData } from "../../models/calendarCellData";
import { formatKey } from "../../helpers";
import { WeekPlannerProps } from "./index";
import { TimeBlock } from "../../models/timeBlock";

export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const getHours = (
  startTime: string = "06:00",
  endTime: string = "20:00",
  interval: number
) => {
  const timeConfig = { hour: "2-digit", minute: "2-digit" };
  const lang = "pl";
  let hours: string[] = [];

  let splitStartHour = startTime.split(":");
  let splitEndHour = endTime.split(":");

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

export const getCalendarCellsData = (
  hours: string[],
  days: Date[],
  props: WeekPlannerProps
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
      let firstSplit = timeRange.split("-");
      let hours = firstSplit[0].split(":")[0];
      let minutes = firstSplit[0].split(":")[1];
      let tmpDate = new Date(day);
      tmpDate.setHours(+hours, +minutes, 0, 0);
      let key = formatKey(tmpDate);
      let block = blocksByDay[key];
      if (!block) throw new Error("No block found");
      tmpCalendarCellData.push({
        style: {
          gridRow: `${k + 2}/${k + 3}`,
          gridColumn: `${i + 2}/${i + 3}`,
        },
        timeBlock: blocksByDay[key],
      });
      k++;
    }
    i++;
  }
  return tmpCalendarCellData;
};
