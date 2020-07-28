import React, { CSSProperties, useState, useEffect } from "react";
import "./index.css";
import { CalendarCell } from "../calendarCell";
import { Appointment } from "../../models/appointment";
import { Uuid } from "../../helpers";

interface WeekPlannerProps {
  interval: number;
  selectedDate: Date;
  endHour: string;
  startHour: string;
  appointments: Appointment[];
}

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const initGrid = (props: WeekPlannerProps, lang: string) => {
  const timeConfig = { hour: "2-digit", minute: "2-digit" };
  const selectedDateString = formatDate(props.selectedDate);
  let helperDate = new Date(`${selectedDateString} ${props.startHour}`);
  let timeStamps: string[] = [];
  let splitedEndHour = props.endHour.split(":");
  while (
    helperDate.getHours() !== Number(splitedEndHour[0]) ||
    helperDate.getMinutes() !== Number(splitedEndHour[1])
  ) {
    let newItem = "";
    newItem += helperDate.toLocaleTimeString(lang, timeConfig) + " - ";
    helperDate.setTime(helperDate.getTime() + props.interval * 60000);
    newItem += helperDate.toLocaleTimeString(lang, timeConfig);
    timeStamps.push(newItem);
  }

  let baseDay = props.selectedDate.getDay();
  let newDates: Date[] = [];
  for (let i = 1; i <= 7; i++) {
    let newDate = new Date(props.selectedDate);
    newDate.setDate(newDate.getDate() + (i - baseDay));
    newDates.push(newDate);
  }

  return {
    timeStamps,
    weekDays: newDates,
  };
};

const WeekPlanner = (props: WeekPlannerProps) => {
  const [calendarCells, setCalendarCells] = useState<any>([]);
  const [weekDays, setWeekdays] = useState<any>([]);
  const [timeStamps, setTimeStamps] = useState<any>([]);

  useEffect(() => {
    const lang = "pl";

    const { timeStamps, weekDays } = initGrid(props, lang);

    setTimeStamps(timeStamps);
    setWeekdays(weekDays);

    let tmpCalendarCellData: any[] = [];
    let i = 0;
    for (let timeStamp of timeStamps) {
      let k = 0;
      for (let day of weekDays) {
        tmpCalendarCellData.push({
          style: {
            gridColumn: `${k + 2}/${k + 3}`,
            gridRow: `${i + 2}/${i + 3}`,
          },
          appointments: [],
          day,
          timeStamp,
        });

        k++;
      }
      i++;
    }

    props.appointments.forEach((appointment) => {
      let uniformDate = "July 28, 2020 ";
      let capacityStartDate = new Date(
        `${uniformDate} ${appointment.startDate.getHours()}:${appointment.startDate.getMinutes()}`
      );

      for (let data of tmpCalendarCellData) {
        let splited = data.timeStamp.split("-");
        let startDate = new Date(`${uniformDate} ${splited[0]}`);
        let endDate = new Date(`${uniformDate} ${splited[1]}`);

        if (formatDate(appointment.startDate) !== formatDate(data.day))
          continue;
        //TODO: We assume that treatment always fit in one cell
        if (
          capacityStartDate.getTime() >= startDate.getTime() &&
          capacityStartDate.getTime() < endDate.getTime()
        ) {
          data.appointments.push(appointment);
          break;
        }
      }
    });
    setCalendarCells(tmpCalendarCellData);
  }, [props]);

  return (
    <div className="planner-container">
      {weekDays.map((x: any, i: number) => {
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
      {timeStamps.map((time: any, i: number) => {
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
      {calendarCells.map((data: any) => {
        return (
          <CalendarCell
            key={Uuid.uuidv4()}
            appointments={data.appointments as Appointment[]}
            style={data.style as CSSProperties}
            maxNumberOfPatients={10}
          />
        );
      })}
    </div>
  );
};

export default WeekPlanner;
