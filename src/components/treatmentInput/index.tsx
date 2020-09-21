import React, {ReactNode, useEffect, useState} from 'react';
import {InputNumber, Select, Space} from "antd";
import {Uuid} from "../../helpers";
import {Treatment} from "../../models/treatment";
import {Recommendation} from "../../models/recommendation";
import {Constraint, constraints} from "../../mock/constraints";
import {Tag} from 'antd';
import {ProximityConstraintUI} from "../proximityConstraint";
import {MinusCircleOutlined} from "@ant-design/icons";

const {CheckableTag} = Tag;
const {Option} = Select;

interface TreatmentInputProps {
    value?: any;
    treatments: Treatment[],
    onChange: (recommendation: Recommendation) => void;
    onDelete: () => void;
}

const TreatmentInput = (props: TreatmentInputProps) => {
    const [repeat, setRepeat] = useState(props.value ? props.value.repeat : 1);
    const [treatment, setTreatment] = useState(props.value ? props.value.treatment : props.treatments[0]);
    const [selectedConstraints, setSelectedConstraints] = useState<Constraint[]>([]);
    const [constraintsData, setConstraintsData] = useState<any[]>([]);

    const triggerOnChange = () => {
        if (props.onChange) props.onChange({
            Repeat: repeat,
            Treatment: treatment
        })
    }

    const onTreatmentChange = (treatmentId: string) => {
        let treatment = props.treatments.find(x => x.Id === treatmentId)
        if (treatment) setTreatment(treatment);
    };

    const onNumberChanged = (howMany: string | number | undefined) => {
        if (howMany) setRepeat(+howMany);
    }

    useEffect(() => {
        triggerOnChange()
    }, [constraintsData, treatment, repeat])


    const onConstraintClick = (isChecked: boolean, constraint: Constraint) => {
        setSelectedConstraints(isChecked ? [...selectedConstraints, constraint] : selectedConstraints.filter(x => x.Type !== constraint.Type))
        if (!isChecked) setConstraintsData([...constraintsData.filter(x => x.type !== constraint.Type)]);
    }

    const constraintsUI: { [id: string]: ReactNode } = {
        "proximity": <ProximityConstraintUI key={"proximity-constraint"} onChange={(data: any) => {
            if (!data) return;
            let dataWithId = {type: "proximity", ...data};
            setConstraintsData([...constraintsData.filter(x => x.type !== dataWithId.type), dataWithId])
        }}/>
    }

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
            <Space direction={"horizontal"}>
                {constraints.map(constraint => <CheckableTag checked={selectedConstraints.indexOf(constraint) > -1}
                                                             onChange={(isChecked) => onConstraintClick(isChecked, constraint)}
                                                             key={constraint.Type + "-treatmentInput"}>{constraint.Text}</CheckableTag>)}
            </Space>
            <Space>
                {selectedConstraints.map(constraint => constraintsUI[constraint.Type])}
            </Space>
        </Space>
    );
};

export default TreatmentInput;