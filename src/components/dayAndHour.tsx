import React from "react";
import {Select, TimePicker} from "antd";
import {Uuid} from "../helpers";
import moment from 'moment';
import {defaultBlocksConfig} from "../models/timeBlockConfig";

const {Option} = Select;
const {RangePicker} = TimePicker;

export interface DayAndHourValue {
    day: string;
    prevSelectedDay: string;
    hourRange?: any;
}

interface DayAndHourProps {
    value?: any;
    days: { [key: number]: string };
    allDays: { [key: number]: string };
    onChange?: (value: DayAndHourValue) => void;
    onUnmount?: (value: DayAndHourValue) => void;
}

interface DayAndHourState {
    day: string;
    prevSelectedDay: string;
    hourRange?: any;
}

export class DayAndHour extends React.Component<DayAndHourProps,
    DayAndHourState> {
    constructor(props: DayAndHourProps) {
        super(props);
        this.state = {
            day: this.props.value ? this.props.value.initDay : undefined,
            prevSelectedDay: "",
            hourRange: {},
        };
    }

    onDayChange = (value: string) => {
        this.setState(
            (state, props) => ({
                prevSelectedDay: state.day,
                day: value,
            }),
            () => this.triggerOnChange()
        );
    };

    onHourChange = (value: any) => {
        this.setState(
            (state, props) => ({
                hourRange: value,
            }),
            () => this.triggerOnChange()
        );
    };

    triggerOnChange = () => {
        if (!this.state.day) return;
        if (this.props.onChange)
            this.props.onChange({
                ...this.state,
            });
    };

    componentWillUnmount() {
        if (!this.state.day) return;
        if (this.props.onUnmount)
            this.props.onUnmount({
                ...this.state,
            });
    }

    render() {
        const children = [];
        for (let key in this.props.days) {
            children.push(
                <Option value={key} key={Uuid.uuidv4()}>
                    {this.props.days[key]}
                </Option>
            );
        }
        const processedInitData = {
            initDay: this.props.value ? this.props.value.initDay : undefined,
            startHour: this.props.value ? this.props.value.startHour : defaultBlocksConfig.startHour,
            endHour: this.props.value ? this.props.value.endHour : defaultBlocksConfig.endHour,
        }

        return (
            <>
                <Select
                    style={{width: "25%", margin: "0 10px 0 0"}}
                    onChange={this.onDayChange}
                    defaultValue={this.props.allDays[processedInitData.initDay]}
                    placeholder="Dzień"
                >
                    {children}
                </Select>
                <RangePicker
                    picker={"time"}
                    format={"HH:mm"}
                    defaultValue={[moment(processedInitData.startHour, 'HH:mm:ss'), moment(processedInitData.endHour, 'HH:mm:ss')]}
                    onChange={(value) => (value ? this.onHourChange(value) : () => {
                    })}
                />
            </>
        );
    }
}
