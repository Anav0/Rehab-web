import React, {useEffect, useState} from 'react';
import {CalendarCell} from '../calendar-cell';
import {TimeBlock} from '../../models/timeBlock';
import {CalendarCellData} from '../../models/calendarCellData';
import {Uuid} from '../../helpers/uuid';
import {formatDate, getCalendarCellsData, getDaysOfWeekForDate, getHours} from "./operations";
import {useMarkers} from "../../store/markers";
import {WeekPlannerContainer, WeekPlannerDay, WeekPlannerElement} from "./styled";
import {useTreatments} from "../../store/treatments";
import {Result} from "antd";

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
    const [{marker},] = useMarkers();
    const [{treatmentsDict},] = useTreatments()

    useEffect(() => {
        if (props.timeBlocks.length <= 0) return;
        console.log("Calendar render")
        let hours = getHours(props.startHour, props.endHour, props.timeBlocks[0].DurationInMinutes);
        let days = getDaysOfWeekForDate(props.selectedDate);
        setHours(hours);
        setDays(days);
        let calendarCells = getCalendarCellsData(hours, days, props);
        if (marker) marker.mark(calendarCells)
        setCalendarCells(calendarCells);
    }, [props.timeBlocks, marker]);

    return (
        <>
            {props.timeBlocks.length > 0 ?
                <WeekPlannerContainer>
                    {days.map((x: any, i: number) => {
                        let isToday = false;
                        if (formatDate(new Date()) === formatDate(x)) isToday = true;

                        let style = {
                            gridColumn: `1/2`,
                            gridRow: `${i + 2}/${i + 3}`,
                        };

                        return (
                            <WeekPlannerDay style={style}
                                            className={`${isToday ? 'bold' : ''}`}
                                            key={x.toString()}>{x.toLocaleDateString('pl', {weekday: 'long',})}
                                <br/>
                                {x.toLocaleDateString('pl', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
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
                                treatmentsDict={treatmentsDict}
                                cellData={data}
                            />
                        );
                    })}
                </WeekPlannerContainer> : <Result
                    className={'center'}
                    status="error"
                    title="Brak bloków czasowych dla wybranych dat"
                />}
        </>
    );
};

export default WeekPlanner;
