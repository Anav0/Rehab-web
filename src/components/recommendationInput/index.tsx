import React, {CSSProperties, useEffect, useState} from 'react';
import { InputNumber, Select, Space} from "antd";
import {Uuid} from "../../helpers";
import {Treatment} from "../../models/treatment";
import {Recommendation} from "../../models/recommendation";

const { Option } = Select;

interface RecommendationInputProps {
    value?: any;
    treatments: Treatment[],
    onChange: (recommendation: Recommendation) => void;
    style?: CSSProperties
}

const RecommendationInput = (props: RecommendationInputProps) => {
    const [repeat, setRepeat] = useState(props.value ? props.value.repeat : 1);
    const [treatment, setTreatment] = useState(props.value ? props.value.treatment : props.treatments[0]);

    const triggerOnChange = ()=>{
        if(props.onChange) props.onChange({
            repeat: repeat,
            treatment
        })
    }

    const onTreatmentChange = (treatmentId: string) => {
        let treatment = props.treatments.find(x=>x.Id===treatmentId)
        if(treatment) setTreatment(treatment);
    };

    const onNumberChanged = (howMany: string | number | undefined) => {
        if(howMany) setRepeat(+howMany);
    }

    useEffect(()=>{
        triggerOnChange()
    },[treatment, repeat])

    return (
        <Space style={props.style} direction={"horizontal"}>
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
            <InputNumber required placeholder={"Ilość powtórzeń"} style={{width: '150px'}} min={1} max={50} defaultValue={repeat} onChange={onNumberChanged}/>
        </Space>
    );
};

export default RecommendationInput;