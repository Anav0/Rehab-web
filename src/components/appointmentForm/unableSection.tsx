import * as React from 'react';
import {Button, Form, Typography,} from "antd";
import "moment/locale/pl";
import localePL from "antd/es/date-picker/locale/pl_PL";
import {DatePicker, Space} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";

const {Title} = Typography;

const {RangePicker} = DatePicker;

interface UnableSectionContentProps {
    value?: any;
    onChange: (dataRange: any) => void
}

const UnableSectionContent = (props: UnableSectionContentProps) => {
    let start = props.value ? props.value[0] : null;
    let end = props.value ? props.value[1] : null;
    const [selectedDateRange, setSelectedDateRange] = useState<any>([start, end]);

    const onChange = (dateRange: any) => {
        let start = dateRange[0];
        let end = dateRange[1];
        setSelectedDateRange([start, end])
    }

    useEffect(() => {
        props.onChange(selectedDateRange)
    }, [selectedDateRange])

    return (<RangePicker defaultValue={selectedDateRange} onChange={onChange} locale={localePL}/>)
}

export const UnableSection = () => {
    return (
        <>
            <Title level={4}>Niemożliwy termin wizyty</Title>
            <Form.List name="unavailableDates">
                {(fields: any, options: any) => {
                    return (
                        <Space style={{width: '100%'}} direction={"vertical"}>
                            {fields.map((field: any) => {
                                return (
                                    <Space key={field.key} direction={"horizontal"} align={"baseline"}>
                                        <Form.Item rules={[
                                            {
                                                required: true,
                                                message: "Proszę wybrać zakres",
                                            },
                                        ]}  {...field} fieldKey={field.fieldKey}>
                                            <UnableSectionContent onChange={() => {
                                            }}/>
                                        </Form.Item>
                                        <MinusCircleOutlined
                                            style={{marginLeft: "10px"}}
                                            onClick={() => {
                                                options.remove(field.name);
                                            }}
                                        />
                                    </Space>
                                );
                            })}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        options.add();
                                    }}
                                    block
                                >
                                    <PlusOutlined/> Dodaj zakres
                                </Button>
                            </Form.Item>
                        </Space>
                    );
                }}
            </Form.List>

        </>
    );
};