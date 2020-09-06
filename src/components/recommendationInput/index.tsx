import React, {CSSProperties, useEffect, useState} from 'react';
import { InputNumber, Select, Space} from "antd";
import {Uuid} from "../../helpers";
import {Treatment} from "../../models/treatment";
import {Recommendation} from "../../models/recommendation";

const { Option } = Select;



interface RecommendationInputProps {
    treatments: Treatment[],
    onChange: (recommendation: Recommendation) => void;
    style?: CSSProperties
}

const RecommendationInput = (props: RecommendationInputProps) => {

    const [howManyTimes, setHowManyTimes] = useState(1);
    const [treatment, setTreatment] = useState(props.treatments[0]);

    const triggerOnChange = ()=>{
        if(props.onChange) props.onChange({
            repeat: howManyTimes,
            treatment
        })
    }

    const onTreatmentChange = (treatmentId: string) => {
        let treatment = props.treatments.find(x=>x.Id===treatmentId)
        if(treatment) setTreatment(treatment);
    };

    const onNumberChanged = (howMany: string | number | undefined) => {
        if(howMany) setHowManyTimes(+howMany);
    }

    useEffect(()=>{
        triggerOnChange()
    },[treatment, howManyTimes])

    return (
        <Space style={props.style} direction={"horizontal"}>
            <Select
                style={{width: '150px'}}
                placeholder="Wyszukaj procedurę"
                defaultValue={props.treatments[0].Id}
                onChange={onTreatmentChange}>
                {props.treatments.map((treatment) => {
                    return (
                        <Option key={Uuid.uuidv4()} value={treatment.Id}>
                            {treatment.Name}
                        </Option>
                    );
                })}
            </Select>
            <InputNumber required placeholder={"Ilość powtórzeń"} style={{width: '150px'}} min={1} max={50} defaultValue={1} onChange={onNumberChanged}/>
        </Space>
    );
};

export default RecommendationInput;