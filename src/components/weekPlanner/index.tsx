import React, { useState, useEffect } from "react";
import "./index.css";
import { CalendarCell } from "../calendarCell";
import { copy } from "../../helpers";
import { TimeBlock } from "../../models/timeBlock";
import { formatKey } from "../../mock/timeBlocks";
import { CalendarCellData } from "../../models/calendarCellData";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";
import { sitesByDay } from "../../mock/sites";
import { Uuid } from "../../helpers/uuid";

interface WeekPlannerProps {
  interval: number;
  selectedDate: Date;
  endHour: string;
  startHour: string;
  timeBlocks: TimeBlock[];
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

  let changingDate = new Date();
  changingDate.setHours(+splitedStartHour[0], +splitedStartHour[1], 0);

  let referenceDate = new Date();
  referenceDate.setHours(+splitedEndHour[0], +splitedEndHour[1], 0);

  do {
    let newHour = "";
    newHour += changingDate.toLocaleTimeString(lang, timeConfig);
    changingDate.setTime(changingDate.getTime() + props.interval * 60000);
    hours.push(newHour);
  } while (changingDate.getTime() <= referenceDate.getTime());
  return hours;
};

const getMonday=(d: Date)=> {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6:1);
  return new Date(d.setDate(diff));
}

const getDays = (selectedDate: Date) => {
  let days: Date[] = [];
  let monday = getMonday(selectedDate)
  for (let i = 0; i < 7; i++) {
    let tmp = new Date(monday);
    tmp.setDate(tmp.getDate()+i)
    days.push(tmp);
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

const WeekPlanner = (props: WeekPlannerProps) => {
  const [calendarCells, setCalendarCells] = useState<CalendarCellData[]>([]);
  const [days, setDays] = useState<any>([]);
  const [hours, setHours] = useState<any>([]);

  useEffect(() => {
    let hours = getHours(props);
    let days = getDays(props.selectedDate);
    let calendarCells = getCalendarCellsData(hours, days, props);
    setHours(hours);
    setDays(days);
    setCalendarCells(calendarCells);
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

        return (
          <span style={style} className={`planner-day ${isToday ? "bold" : ""}`} key={x.toString()}>
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
