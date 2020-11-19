import React from 'react';
import {Select, TimePicker} from 'antd';
import {Uuid} from '../helpers/uuid';
import moment from 'moment';
import {defaultBlocksConfig} from '../models/timeBlockConfig';
import {TimePreference} from '../models/timePreference';

const {Option} = Select;
const {RangePicker} = TimePicker;

interface DayAndHourProps {
    value?: any;
    days: { [key: number]: string };
    allDays: { [key: number]: string };
    onChange?: (value: TimePreference) => void;
    onUnmount?: (value: TimePreference) => void;
}

export class DayAndHour extends React.Component<DayAndHourProps, TimePreference> {
    constructor(props: DayAndHourProps) {
        super(props);
        this.state = {
            day: this.props.value ? this.props.value.initDay : undefined,
            prevSelectedDay: '',
            hourRange: props.value ?
                [
                    moment(props.value.startHour, 'HH:mm:ss'),
                    moment(props.value.endHour, 'HH:mm:ss')] :
                [
                    moment(defaultBlocksConfig.startHour, 'HH:mm:ss'),
                    moment(defaultBlocksConfig.endHour, 'HH:mm:ss')],
        };
        this.triggerOnChange();
    }

    onDayChange = (value: string) => {
        this.setState(
            (state) => ({
                prevSelectedDay: state.day,
                day: value,
            }),
            () => this.triggerOnChange(),
        );
    };

    onHourChange = (value: any) => {
        this.setState(
            () => ({
                hourRange: value,
            }),
            () => this.triggerOnChange(),
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
                </Option>,
            );
        }

        const initDay = this.props.value ?
            this.props.allDays[+this.props.value.initDay] :
            undefined;

        return (
            <>
                <Select
                    style={{width: '25%', margin: '0 10px 0 0'}}
                    onChange={this.onDayChange}
                    defaultValue={initDay}
                    placeholder='Dzień'
                >
                    {children}
                </Select>
                <RangePicker
                    format={'HH:mm'}
                    defaultValue={this.state.hourRange}
                    onChange={this.onHourChange}
                />
            </>
        );
    }
}
