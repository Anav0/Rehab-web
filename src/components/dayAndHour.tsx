import React from 'react';
import { Select,  TimePicker} from 'antd';
import {Uuid} from "../helpers";

const { Option } = Select;
const { RangePicker } = TimePicker;

export interface DayAndHourValue {
    day: string;
    prevSelectedDay: string;
    hourRange?: any;
}

interface DayAndHourProps {
    days: {[key: number]: string},
    onChange?: (value: DayAndHourValue) => void;
    onUnmount?: (value: DayAndHourValue) => void;
}

interface DayAndHourState{
    day: string,
    prevSelectedDay: string,
    hourRange?: any
}

export class DayAndHour extends React.Component<DayAndHourProps,DayAndHourState> {

    constructor(props: DayAndHourProps) {
        super(props);
        this.state = {
            day: '',
            prevSelectedDay: '',
            hourRange: {}
        }
    }

    onDayChange =(value: string) => {

        this.setState((state,props)=>({
            prevSelectedDay: state.day,
            day: value
        }),()=>this.triggerOnChange())
    }

    onHourChange =(value:any) => {
        this.setState((state,props)=>({
            hourRange: value
        }),()=>this.triggerOnChange())
    }

    triggerOnChange = () => {
        if(!this.state.day) return;
        if(this.props.onChange) this.props.onChange({
           ...this.state
        })
    }

    componentWillUnmount() {
        if(!this.state.day) return;
        if(this.props.onUnmount) this.props.onUnmount({
            ...this.state
        })
    }

    render(){
        const children = [];
        for(let key in this.props.days){
            children.push(<Option value={key} key={Uuid.uuidv4()}>{this.props.days[key]}</Option>);
        }
        return (
            <>
                <Select
                    style={{ width: '25%', margin: '0 10px 0 0' }}
                    onChange={this.onDayChange}
                    placeholder="Dzień"

                >
                    {children}
                </Select>
                <RangePicker picker={"time"} format={'HH:mm'} onChange={(value)=>value ? this.onHourChange(value) : ()=>{}}/>
            </>
        );
    }


};