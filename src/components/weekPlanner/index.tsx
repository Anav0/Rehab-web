import React, { useState, useEffect } from "react";
import "./index.css";
import { CalendarCell } from "../calendarCell";
import { Uuid, copy } from "../../helpers";
import { TimeBlock } from "../../models/timeBlock";
import { formatKey } from "../../mock/timeBlocks";
import { CalendarCellData } from "../../models/calendarCellData";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";
import { Appointment } from "../../models/appointment";
import { sitesByDay } from "../../mock/sites";

interface WeekPlannerProps {
  interval: number;
  selectedDate: Date;
  endHour: string;
  startHour: string;
  timeBlocks: TimeBlock[];
  appointments: Appointment[];
  unavailableDates: any;
}

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const getHours = (props: WeekPlannerProps) => {
  const timeConfig = { hour: "2-digit", minute: "2-digit" };
  const lang = "pl";
  let hours: string[] = [];

  let splitedEndHour = props.endHour.split(":");
  let splitedStartHour = props.startHour.split(":");

  let helperDate = new Date();
  helperDate.setHours(+splitedStartHour[0], +splitedStartHour[1], 0);

  let endTime = new Date();
  endTime.setHours(+splitedEndHour[0], +splitedEndHour[1], 0);

  do {
    let newItem = "";
    newItem += helperDate.toLocaleTimeString(lang, timeConfig);
    helperDate.setTime(helperDate.getTime() + props.interval * 60000);
    hours.push(newItem);
  } while (helperDate.getTime() <= endTime.getTime());
  return hours;
};

const getDays = (selectedDate: Date) => {
  let baseDay = selectedDate.getDay();
  let days: Date[] = [];
  for (let i = 1; i <= 7; i++) {
    let newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (i - baseDay));
    days.push(newDate);
  }
  return days;
};

const convertToDictionaryByDate = (list: any[]) => {
  let output: {
    [key: string]: any;
  } = {};
  for (let element of list) {
    let key = formatKey(element.StartDate);
    output[key] = element;
  }
  return output;
};

const isTimeBlockAvailable = (timeBlock: TimeBlock, unavailableDates: any) : boolean => {
  if(!unavailableDates) return true;
 for(let pair of unavailableDates){
    let start = new Date(pair[0]);
    start.setHours(0, 0, 0, 0)
    let end = new Date(pair[1]);
    end.setHours(23, 0, 0, 0)
    if(timeBlock.StartDate.getTime() >= start.getTime() && timeBlock.StartDate.getTime() <= end.getTime()) return false
  }
  return true;
}

const getCalendarCellsData = (
  hours: string[],
  days: Date[],
  props: WeekPlannerProps
) => {
  let tmpCalendarCellData: CalendarCellData[] = [];
  let i = 0;

  let blocksByDay = convertToDictionaryByDate(props.timeBlocks);

  for (let timeStamp of hours) {
    let k = 0;

    for (let day of days) {
      let firstSplit = timeStamp.split("-");
      let hours = firstSplit[0].split(":")[0];
      let minutes = firstSplit[0].split(":")[1];
      let tmpDate = new Date(day);
      tmpDate.setHours(+hours, +minutes, 0, 0);
      let key = formatKey(tmpDate);

      let sitesForGivenDay = copy(sitesByDay[tmpDate.getDay()]);

      tmpCalendarCellData.push({
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
                sitesForGivenDay
              ),
        day,
        timeStamp,
        isNew: blocksByDay[key] != null ? blocksByDay[key].IsNew : false,
        isBlocked: blocksByDay[key] != null ? !isTimeBlockAvailable(blocksByDay[key], props.unavailableDates) : false
      });
      k++;
    }
    i++;
  }
  return tmpCalendarCellData;
};

const initGrid = (props: WeekPlannerProps) => {
  const hours = getHours(props);
  const days = getDays(props.selectedDate);
  const calendarCells = getCalendarCellsData(hours, days, props);

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
          gridColumn: `1/2`,
          gridRow: `${i + 2}/${i + 3}`,
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
          gridColumn: `${i + 2}/${i + 3}`,
          gridRow: `1/2`,
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
            isBlocked={data.isBlocked}
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
