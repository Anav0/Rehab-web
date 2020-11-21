import React, {useEffect, useState} from 'react';
import './index.css';
import {CalendarCell} from '../calendarCell';
import {TimeBlock} from '../../models/timeBlock';
import {CalendarCellData} from '../../models/calendarCellData';
import {Uuid} from '../../helpers/uuid';
import {formatDate, getCalendarCellsData, getDaysOfWeekForDate, getHours} from "./operations";
import {ICalendarCellDataMarker} from "../../helpers/calendar-marking";
import patients from "../../mock/patients";
import {PatientsCellDataMarker} from "../../helpers/calendar-marking/patients-marker";

export interface WeekPlannerProps {
    interval: number;
    selectedDate: Date;
    endHour: string;
    startHour: string;
    timeBlocks: TimeBlock[];
    unavailableDates: any;
}

const WeekPlanner = (props: WeekPlannerProps) => {
    const [calendarCells, setCalendarCells] = useState<CalendarCellData[]>([]);
    const [days, setDays] = useState<any>([]);
    const [hours, setHours] = useState<any>([]);
    const [marker, ] = useState<ICalendarCellDataMarker>(new PatientsCellDataMarker(patients));

    useEffect(() => {
        let hours = getHours(props.startHour, props.endHour, props.interval);
        let days = getDaysOfWeekForDate(props.selectedDate);
        let calendarCells = getCalendarCellsData(hours, days, props);
        setHours(hours);
        setDays(days);
        marker.mark(calendarCells)
        setCalendarCells(calendarCells);
    }, [props]);

    return (
        <div className='planner-container'>
            {days.map((x: any, i: number) => {
                let isToday = false;
                if (formatDate(new Date()) === formatDate(x)) isToday = true;

                let style = {
                    gridColumn: `1/2`,
                    gridRow: `${i + 2}/${i + 3}`,
                };

                return (
                    <span style={style}
                          className={`planner-day ${isToday ? 'bold' : ''}`}
                          key={x.toString()}>{x.toLocaleDateString('pl', {weekday: 'long',})}
                        <br/>
                        {x.toLocaleDateString('pl', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
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
                    <span style={style} className='planner-hour' key={time}>
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
