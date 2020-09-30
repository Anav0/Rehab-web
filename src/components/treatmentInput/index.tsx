import React, {useCallback, useEffect, useState} from 'react';
import {InputNumber, Select, Space} from "antd";
import {Uuid} from "../../helpers";
import {Treatment} from "../../models/treatment";
import {Recommendation} from "../../models/recommendation";
import {Constraint} from "../../mock/constraints";
import {MinusCircleOutlined} from "@ant-design/icons";

const {Option} = Select;

interface TreatmentInputProps {
    value?: Recommendation;
    treatments: Treatment[],
    onChange: (recommendation: Recommendation) => void;
    onDelete: () => void;
}

const TreatmentInput = (props: TreatmentInputProps) => {
    const [repeat, setRepeat] = useState(props.value ? props.value.Repeat : 1);
    const [treatment, setTreatment] = useState(props.value ? props.value.Treatment : props.treatments[0]);

    const onTreatmentChange = (treatmentId: string) => {
        let treatment = props.treatments.find(x => x.Id === treatmentId)
        if (treatment) setTreatment(treatment);
    };

    const onNumberChanged = (howMany: string | number | undefined) => {
        if (howMany) setRepeat(+howMany);
    }

    useEffect(() => {
        props.onChange({
            Repeat: repeat,
            Treatment: {...treatment}
        })
    }, [repeat, treatment])

    return (
        <Space direction={"vertical"} size={"large"}>
            <Space direction={"horizontal"}>
                <Select
                    style={{width: '150px'}}
                    placeholder="Wyszukaj procedurę"
                    defaultValue={treatment.Id}
                    onChange={onTreatmentChange}>
                    {props.treatments.map((treatment) => {
                        return (
                            <Option key={Uuid.uuidv4()} value={treatment.Id}>
                                {treatment.Name} {`(${treatment.DurationInMinutes}m)`}
                            </Option>
                        );
                    })}
                </Select>
                <InputNumber required placeholder={"Ilość powtórzeń"} style={{width: '150px'}} min={1} max={50}
                             defaultValue={repeat} onChange={onNumberChanged}/>
                <MinusCircleOutlined
                    style={{marginLeft: "10px"}}
                    onClick={() => {
                        props.onDelete();
                    }}
                />
            </Space>
        </Space>
    );
};

export default TreatmentInput;