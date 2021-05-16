import {Result} from "antd";
import React, {useEffect, useState} from "react";
import {Uuid} from "../../helpers/uuid";
import {useEffectAfterStartup} from "../../hooks";
import {CalendarCellData} from "../../models/calendarCellData";
import {Proposition} from "../../models/Proposition";
import {TimeBlock} from "../../models/timeBlock";
import {useMarkers} from "../../store/markers";
import {useProposition} from "../../store/proposition";
import {useTreatments} from "../../store/treatments";
import {CalendarCell} from "../calendar-cell";
import {formatDate, genCalendarCellsData, generateHoursBasedOnInterval, getAllDaysOfTheWeekForGivenDate} from "./operations";
import {WeekPlannerContainer, WeekPlannerDay, WeekPlannerElement} from "./styled";

export interface WeekPlannerProps {
    selectedDate: Date;
    endHour: string;
    startHour: string;
    timeBlocks: TimeBlock[];
}

const WeekPlanner = (props: WeekPlannerProps) => {
        const [calendarCells, setCalendarCells] = useState<CalendarCellData[]>([]);
        const [days, setDays] = useState<any>([]);
        const [hours, setHours] = useState<any>([]);
        const [{marker}] = useMarkers();
        const [{treatmentsDict}] = useTreatments();
        const [{proposition}] = useProposition();
        const [setOfPropositionDates, setSetOfPropositionDates] = useState<Set<number>>(new Set());

        const onMarkerChange = () => {
            console.log(`${onMarkerChange.name} | Calendar render`);
            if (marker) marker.mark(calendarCells);
            setCalendarCells(calendarCells);
        }

        const onInit = () => {
            console.log(`${onInit.name} | Calendar render`);

            let hours = generateHoursBasedOnInterval(
                props.startHour,
                props.endHour,
                props.timeBlocks[0].DurationInMinutes,
            );
            setHours(hours);

            let days = getAllDaysOfTheWeekForGivenDate(props.selectedDate);
            setDays(days)
        }

        const onStart = () => {
            if (props.timeBlocks.length <= 0) return;

            console.log(`${onStart.name} | Calendar render`);

            props.timeBlocks.sort((a,b)=>a.StartDate < b.StartDate ? -1 : 1)
            console.log(props.timeBlocks);
            let cells = genCalendarCellsData(
                hours,
                days,
                props.timeBlocks,
            );
            setCalendarCells(cells);
        }

        const onPropositionChange = () => {
            console.log(`${onPropositionChange.name} | Calendar render`);
            let tmp = new Set<number>();
            for (let dates of proposition.ScheduledDates) {
                for (let date of dates) {
                    console.log(date)
                    tmp.add(+date);
                }
            }
            console.log(tmp)
            setSetOfPropositionDates(tmp);
        }

        useEffect(onInit, []);
        useEffectAfterStartup(onStart, [days]);
        useEffectAfterStartup(onMarkerChange, [calendarCells, marker]);
        useEffect(onPropositionChange, [proposition]);

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
                                    {x.toLocaleDateString("pl", {weekday: "long"})}
                                    <br/>
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
                                    isProposed={setOfPropositionDates.has(+data.timeBlock.StartDate)}
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
    }
;

export default WeekPlanner;
