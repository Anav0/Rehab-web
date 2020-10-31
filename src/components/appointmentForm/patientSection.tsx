import * as React from 'react';
import {AutoComplete, Form, Select} from "antd";
import {Patient} from "../../models/patient";
import {useState} from "react";
import mockPatients from "../../mock/patients";

const {Option} = Select;

interface PatientSectionContentProps {
    onChange: (patient: Patient)=>void;
}

const PatientSectionContent = (props: PatientSectionContentProps) => {
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

    const searchPatients = (searchPhrase: string) => {
        searchPhrase = searchPhrase.toLowerCase().trim();
        setFilteredPatients(mockPatients.filter((x: Patient) =>
            x.Name.toLowerCase().includes(searchPhrase)
        ))
    };

    const onSelect = (patientName: string, option: any)=>{
        if(option.patient)
            props.onChange(option.patient);
    }

    return (
        <AutoComplete
            placeholder="Wyszukaj pacjenta"
            onSearch={searchPatients}
            onSelect={onSelect}
        >
            {filteredPatients.map((x) => {
                return (
                    <Option patient={x} key={x.Id} value={x.Name} >
                        {x.Name}
                    </Option>
                );
            })}
        </AutoComplete>
    )
}

export const PatientSection = () => {
    return (
        <Form.Item
            name="patient"
            rules={[{required: true, message: "Proszę wybrać pacjenta"}]}>
           <PatientSectionContent onChange={()=>{}}/>
        </Form.Item>
    );
};