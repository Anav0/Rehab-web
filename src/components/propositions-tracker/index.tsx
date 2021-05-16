import {CarryOutOutlined, CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {Button, Checkbox, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {useProposition} from "../../store/proposition";
import {TrackerBtnContainer, TrackerContainer} from "./styled";

const {Title} = Typography;

class CheckBoxModel {
    dates: number[] = [];
    checked: boolean = false;
    label: string = "";
    value: number = 0;
}

export const PropositionsTracker = () => {
        const [howManyAreSelected, setHowManyAreAccepted] = useState<number>(0);
        const [checkBoxOptions, setCheckBoxOptions] = useState<CheckBoxModel[]>([]);
        const [
            {acceptedDates, proposition},
            {acceptAll, removeAll, acceptBlocksWithDate, removeBlocksWithDate, clear},
        ] = useProposition();

        const genLabelForDates = (dates: number[]) => {
            let label = ``;
            let lang = "de";
            dates.sort((a, b) => (a < b ? -1 : 1));

            label += ` ${new Date(dates[0]).toLocaleDateString(lang, {
                year: "numeric",
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            })}`.replace(",", ": ");

            for (let date of dates.slice(1)) {
                label += ` ${new Date(date).toLocaleDateString(lang, {
                    hour: "2-digit",
                    minute: "2-digit",
                })}`.replace(",", ": ");
            }

            return label;
        };

        useEffect(() => {
                if (!proposition) return;
                console.log("proposition-tracker called");

                let howManyAreAccepted = 0;
                let checkBoxOptionsTmp: CheckBoxModel[] = [];
                for (let i = 0; i < proposition.ScheduledDates.length; i++) {
                    const dates = proposition.ScheduledDates[i];

                    let checkBoxModel = {
                        label: genLabelForDates(dates),
                        value: i,
                        checked: false,
                        dates,
                    };

                    acceptedDates.forEach(value => {
                        if (value[0] == dates[0]) {
                            console.log("TAK")
                            checkBoxModel.checked = true;
                            howManyAreAccepted++;
                            return;
                        }
                    });

                    checkBoxOptionsTmp.push(checkBoxModel);
                }
                setCheckBoxOptions(checkBoxOptionsTmp);
                setHowManyAreAccepted(howManyAreAccepted);
            }, [acceptedDates, proposition],
        );

        const confirmProposition = async () => {
            alert("TODO")
        };
        const clearProposition = () => clear();

        return (
            <TrackerContainer>
                <Title style={{color: "inherit"}} level={4}>
                    Zaznaczono {howManyAreSelected} z {proposition.ScheduledDates.length}
                </Title>
                <div>
                    {checkBoxOptions.map((checkBoxModel) => (
                        <Checkbox
                            checked={checkBoxModel.checked}
                            key={checkBoxModel.value + checkBoxModel.label}
                            value={checkBoxModel.value}
                            onChange={({target}) => {
                                if (!target.checked) removeBlocksWithDate(checkBoxModel.dates[0]);
                                else acceptBlocksWithDate(checkBoxModel.dates[0]);
                            }}
                        >
                            {checkBoxModel.label}
                        </Checkbox>
                    ))}
                </div>
                <TrackerBtnContainer>
                    <Button
                        type={"dashed"}
                        onClick={() => acceptAll()}
                        style={{marginRight: "1rem", background: "transparent"}}
                        icon={<CheckOutlined/>}
                    >
                        Zaznacz wszystkie
                    </Button>
                    <Button
                        onClick={() => removeAll()}
                        type={"dashed"}
                        style={{background: "transparent"}}
                        icon={<CloseOutlined/>}
                    >
                        Odznacz wszystkie
                    </Button>
                </TrackerBtnContainer>
                <TrackerBtnContainer>
                    <Button
                        disabled={acceptedDates.size <= 0}
                        onClick={() => confirmProposition()}
                        style={{background: "transparent"}}
                        icon={<CarryOutOutlined/>}
                    >
                        Zatwierdź
                    </Button>
                    <Button
                        onClick={() => clearProposition()}
                        style={{background: "transparent"}}
                        icon={<CarryOutOutlined/>}
                    >
                        Anuluj
                    </Button>
                </TrackerBtnContainer>
            </TrackerContainer>
        );
    }
;
