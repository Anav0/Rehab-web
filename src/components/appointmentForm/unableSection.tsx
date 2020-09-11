import * as React from 'react';
import {Calendar, Form, Typography,} from "antd";
import "moment/locale/pl";
import localePL from "antd/es/date-picker/locale/pl_PL";
import {useState} from "react";

const {Title} = Typography;

const UnableSectionContent = () => {
    const [selectedDates, setSelectedDates] = useState<number[]>([]);

    const dateCellRender = (date: any) => {
        if(selectedDates.includes(new Date(date).getTime())) return <div>Clicked</div>
        return null;
    }

    const onDaySelect = (date: any)=>{
        let dateMs = new Date(date).getTime();
        if(selectedDates.includes(dateMs)) return;
        setSelectedDates([...selectedDates, dateMs]);
    }

    return (
        <Calendar onSelect={onDaySelect} locale={localePL} dateCellRender={dateCellRender} />
    )
}

export const UnableSection = () => {
    return (
        <>
            <Title level={4}>Niedostępne terminy</Title>
            <Form.Item name={"unavailable-dates"}>
                <UnableSectionContent/>
            </Form.Item>
        </>
    );
};