import React, {useState} from 'react';
import {Affix, Button, Form,  Space,  Typography} from "antd";
import {canAddMoreDays, getPresetBtnsData} from "../../helpers/presets";
import {DayAndHour} from "../dayAndHour";
import {CloseOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {copy, Uuid} from "../../helpers";
import {TimePreference} from "../../models/timePreference";

const {Title} = Typography;

export const TimeSection = () => {
    const days = {
        "0": "Niedziela",
        "1": "Poniedziałek",
        "2": "Wtorek",
        "3": "Środa",
        "4": "Czwartek",
        "5": "Piątek",
        "6": "Sobota",
    };

    const [timeSelectorContainerRef, setTimeSelectorContainerRef] = useState(null);
    const [availableDays, setAvailableDays] = useState<any>(copy(days));
    const [allDays, setAllDays] = useState<any>(copy(days));

    const presets = getPresetBtnsData();

    const filterDaysByDays = (days: string[]) => {
        let usedDays = availableDays;
        for (let day of days) {
            if (usedDays[day])
                delete usedDays[day];
        }
        setAvailableDays(usedDays)
    }

    const filterDays = (value: TimePreference) => {
        if (!value.day) return;
        let tmp = availableDays;
        if (value.prevSelectedDay)
            tmp[value.prevSelectedDay] = allDays[value.prevSelectedDay];

        delete tmp[value.day];
        setAvailableDays(tmp)
    };

    const addDay = (values: TimePreference) => {
        if (!values.day) return;
        let tmp = availableDays;
        tmp[values.day] = allDays[values.day];
        setAvailableDays(tmp)
    };

    return (
        <>
        <div ref={timeSelectorContainerRef}>
            <Title level={4}>Preferowany termin wizyty</Title>
        </div>
            <Form.List  name="times">
                {(fields: any, options: any) => {
                    let canAddMore = canAddMoreDays(fields);
                    return (
                        <>
                            {fields.map((field: any) => {
                                return (
                                    <div key={field.key} className={"day-preference"}>
                                        <Form.Item {...field} fieldKey={field.fieldKey}>
                                            <DayAndHour
                                                onUnmount={(values: TimePreference) =>
                                                    addDay(values)
                                                }
                                                onChange={(values: TimePreference) =>
                                                    filterDays(values)
                                                }
                                                days={availableDays}
                                                allDays={allDays}
                                            />
                                        </Form.Item>
                                        <MinusCircleOutlined
                                            style={{marginLeft: "10px"}}
                                            onClick={() => {
                                                options.remove(field.name);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                            <Affix target={() => timeSelectorContainerRef}>
                                <Space>
                                    <Form.Item>
                                        <Button
                                            disabled={!canAddMore}
                                            type="dashed"
                                            onClick={() => {
                                                options.add();
                                            }}
                                            block
                                        >
                                            <PlusOutlined/> Dodaj wolny dzień
                                        </Button>
                                    </Form.Item>

                                    {presets.map(presetData => {
                                        const disable = presetData.shouldBeDisabled(options, fields);
                                        return (<Form.Item key={Uuid.uuidv4()}>
                                            <Button
                                                disabled={disable}
                                                type="dashed"
                                                onClick={() => {
                                                    let usedDays = presetData.addDays(options)
                                                    filterDaysByDays(usedDays)
                                                }}
                                                block
                                            >
                                                <PlusOutlined/> {presetData.btnTitle}
                                            </Button>
                                        </Form.Item>)
                                    })}
                                </Space>
                            </Affix>
                        </>
                    );
                }}
            </Form.List>
            </>
    );
};