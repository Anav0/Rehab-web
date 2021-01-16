import React, { useEffect, useState } from "react";
import { CalendarCell } from "../calendar-cell";
import { TimeBlock } from "../../models/timeBlock";
import { CalendarCellData } from "../../models/calendarCellData";
import { Uuid } from "../../helpers/uuid";
import {
  formatDate,
  getCalendarCellsData,
  getDaysOfWeekForDate,
  getHours,
} from "./operations";
import { useMarkers } from "../../store/markers";
import {
  WeekPlannerContainer,
  WeekPlannerDay,
  WeekPlannerElement,
  WeekPlannerElement as WeekPlannerHour,
} from "./styled";
import { useTreatments } from "../../store/treatments";
import { Affix, Button, Result } from "antd";
import { MarkCellsContainingBlocks } from "../../merkers/calendar-marking/MarkCellsContainingBlocks";
import { useSchedulingResult } from "../../store/schedulingResult";
import { PlusSquareOutlined } from "@ant-design/icons";
import { SchedulingResult } from "../../models/SchedulingResult";

export interface WeekPlannerProps {
  selectedDate: Date;
  endHour: string;
  startHour: string;
  timeBlocks: TimeBlock[];
}

const isCalendarCellInSchedulingResults = (
  data: CalendarCellData,
  result: SchedulingResult
) => {
  if (!result) return false;

  for (var sol of result.Solutions) {
    if (sol.BlockIds.find((x) => x === data.timeBlock.Id)) return true;
  }
  return false;
};

const WeekPlanner = (props: WeekPlannerProps) => {
  const [calendarCells, setCalendarCells] = useState<CalendarCellData[]>([]);
  const [days, setDays] = useState<any>([]);
  const [hours, setHours] = useState<any>([]);
  const [{ marker }] = useMarkers();
  const [{ treatmentsDict }] = useTreatments();
  const [{ schedulingResult }, {}] = useSchedulingResult();

  useEffect(() => {
    if (props.timeBlocks.length <= 0) return;
    console.log("Calendar render");
    let hours = getHours(
      props.startHour,
      props.endHour,
      props.timeBlocks[0].DurationInMinutes
    );
    let days = getDaysOfWeekForDate(props.selectedDate);
    setHours(hours);
    setDays(days);
    let calendarCells = getCalendarCellsData(hours, days, props);
    if (marker) marker.mark(calendarCells);
    setCalendarCells(calendarCells);
  }, [props.timeBlocks, marker, schedulingResult]);

  return (
    <>
      {props.timeBlocks.length > 0 ? (
        <WeekPlannerContainer>
          {days.map((x: any, i: number) => {
            let isToday = false;
            if (formatDate(new Date()) === formatDate(x)) isToday = true;

            let style = {
              gridColumn: `1/2`,
              gridRow: `${i + 2}/${i + 3}`,
            };

            return (
              <WeekPlannerDay
                style={style}
                className={`${isToday ? "bold" : ""}`}
                key={x.toString()}
              >
                {x.toLocaleDateString("pl", { weekday: "long" })}
                <br />
                {x.toLocaleDateString("pl", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </WeekPlannerDay>
            );
          })}
          {hours.map((time: any, i: number) => {
            let style = {
              gridColumn: `${i + 2}/${i + 3}`,
              gridRow: `1/2`,
            };
            return (
              <WeekPlannerElement style={style} key={time}>
                {time}
              </WeekPlannerElement>
            );
          })}
          {calendarCells.map((data: CalendarCellData) => {
            return (
              <CalendarCell
                key={Uuid.uuidv4()}
                isProposed={isCalendarCellInSchedulingResults(
                  data,
                  schedulingResult
                )}
                treatmentsDict={treatmentsDict}
                cellData={data}
              />
            );
          })}
        </WeekPlannerContainer>
      ) : (
        <Result
          className={"center"}
          status="error"
          title="Brak bloków czasowych dla wybranych dat"
        />
      )}
    </>
  );
};

export default WeekPlanner;
