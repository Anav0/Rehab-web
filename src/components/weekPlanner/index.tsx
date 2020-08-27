import React, { useState, useEffect } from "react";
import "./index.css";
import { CalendarCell } from "../calendarCell";
import { Uuid } from "../../helpers";
import { TimeBlock } from "../../models/timeBlock";
import { emptySites } from "../../mock/sites";
import { formatKey } from "../../mock/timeBlocks";
import { CalendarCellData } from "../../models/calendarCellData";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";

interface WeekPlannerProps {
  interval: number;
  selectedDate: Date;
  endHour: string;
  startHour: string;
  timeBlocks: TimeBlock[];
}

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const initHours = (props: WeekPlannerProps) => {
  const timeConfig = { hour: "2-digit", minute: "2-digit" };
  const selectedDateString = formatDate(props.selectedDate);
  const lang = "pl";
  let helperDate = new Date(`${selectedDateString} ${props.startHour}`);
  let hours: string[] = [];
  let splitedEndHour = props.endHour.split(":");
  while (
    helperDate.getHours() !== Number(splitedEndHour[0]) ||
    helperDate.getMinutes() !== Number(splitedEndHour[1])
  ) {
    let newItem = "";
    newItem += helperDate.toLocaleTimeString(lang, timeConfig) + " - ";
    helperDate.setTime(helperDate.getTime() + props.interval * 60000);
    newItem += helperDate.toLocaleTimeString(lang, timeConfig);
    hours.push(newItem);
  }
  return hours;
};

const initDays = (selectedDate: Date) => {
  let baseDay = selectedDate.getDay();
  let days: Date[] = [];
  for (let i = 1; i <= 7; i++) {
    let newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (i - baseDay));
    days.push(newDate);
  }
  return days;
};

const initCalendarCells = (
  hours: string[],
  days: Date[],
  props: WeekPlannerProps
) => {
  let tmpCalendarCellData: CalendarCellData[] = [];
  let i = 0;

  let blocksByDay: {
    [key: string]: TimeBlock;
  } = {};

  for (let block of props.timeBlocks) {
    let key = formatKey(block.start);
    blocksByDay[key] = block;
  }

  for (let timeStamp of hours) {
    let k = 0;
    for (let day of days) {
      let firstSplit = timeStamp.split("-");
      let hours = firstSplit[0].split(":")[0];
      let minutes = firstSplit[0].split(":")[1];
      let tmpDate = new Date(day);
      tmpDate.setHours(+hours, +minutes);
      tmpDate.setSeconds(0, 0);
      let key = formatKey(tmpDate);

      tmpCalendarCellData.push({
        style: {
          gridColumn: `${k + 2}/${k + 3}`,
          gridRow: `${i + 2}/${i + 3}`,
        },
        timeBlock:
          blocksByDay[key] != null
            ? blocksByDay[key]
            : new TimeBlock(tmpDate, defaultBlocksConfig.duration, emptySites),
        day,
        timeStamp,
        isNew: false,
      });
      k++;
    }
    i++;
  }
  return tmpCalendarCellData;
};

const initGrid = (props: WeekPlannerProps) => {
  const hours = initHours(props);
  const days = initDays(props.selectedDate);
  const calendarCells = initCalendarCells(hours, days, props);

  return {
    hours,
    days,
    calendarCells,
  };
};

const WeekPlanner = (props: WeekPlannerProps) => {
  const [calendarCells, setCalendarCells] = useState<CalendarCellData[]>([]);
  const [days, setDays] = useState<any>([]);
  const [hours, setHours] = useState<any>([]);

  useEffect(() => {
    const { hours, days, calendarCells: calendarCalls } = initGrid(props);
    setHours(hours);
    setDays(days);
    setCalendarCells(calendarCalls);
  }, [props]);

  return (
    <div className="planner-container">
      {days.map((x: any, i: number) => {
        let isToday = false;
        if (formatDate(new Date()) === formatDate(x)) isToday = true;

        let style = {
          gridRow: `1/2`,
          gridColumn: `${i + 2}/${i + 3}`,
        };

        let className = `planner-day ${isToday ? "bold" : ""}`;

        return (
          <span style={style} className={className} key={x.toString()}>
            {x.toLocaleDateString("pl", {
              weekday: "long",
            })}
            <br />
            {x.toLocaleDateString("pl", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        );
      })}
      {hours.map((time: any, i: number) => {
        let style = {
          gridRow: `${i + 2}/${i + 3}`,
          gridColumn: `1/2`,
        };
        return (
          <span style={style} className="planner-hour" key={time}>
            {time}
          </span>
        );
      })}
      {calendarCells.map((data: CalendarCellData) => {
        return (
          <CalendarCell
            isNew={data.isNew}
            key={Uuid.uuidv4()}
            cellData={data}
          />
        );
      })}
    </div>
  );
};

export default WeekPlanner;
