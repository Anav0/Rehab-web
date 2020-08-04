import React, {useEffect, useState} from 'react';
import { Select,  TimePicker} from 'antd';
import {Uuid} from "../helpers";

const { Option } = Select;
const { RangePicker } = TimePicker;

export interface DayAndHourValue {
    day: string;
    hourRange?: any;
}
interface DayAndHourProps {
    days: {[key: number]: string},
    onChange?: (value: DayAndHourValue) => void;
    onUnmount?: (value: DayAndHourValue) => void;
}

export const DayAndHour = (props: DayAndHourProps) => {
    const [day, setDay] = useState<string | undefined>();
    const [hourRange, setHourRange] = useState<string | undefined>();

    const children = [];
    for(let key in props.days){
        // @ts-ignore
        children.push(<Option value={key} key={Uuid.uuidv4()}>{props.days[key]}</Option>);
    }


    const onDayChange =(value: string) =>{
        setDay(value)
    }

    const onHourChange =(value:any) =>{
        setHourRange(value)
    }

    useEffect(()=>{
        const triggerOnChange = ()=>{
            if(!day) return;
            if(props.onChange) props.onChange({
                hourRange,
                day,
            })
        }
        
        triggerOnChange()

        return function cleanup() {
            console.log('CLEANUP')
            if(!day) return;
            if(props.onUnmount) props.onUnmount({
                hourRange,
                day,
            })
        }

    },[day, hourRange, props, triggerOnChange])

    return (
        <>
          <Select
              style={{ width: '25%', margin: '0 10px 0 0' }}
              onChange={onDayChange}
              placeholder="Dzień"

          >
              {children}
          </Select>
          <RangePicker picker={"time"} format={'HH:mm'} onChange={(value)=>value ? onHourChange(value) : ()=>{}}/>
          </>
    );
};