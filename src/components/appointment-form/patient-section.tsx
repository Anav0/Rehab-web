import * as React from 'react';
import {useEffect, useState} from 'react';
import {AutoComplete, Form, Select} from 'antd';
import {Patient} from '../../models/patient';
import mockPatients from '../../mock/patients';
import {usePatients} from "../../store/patients";
import {filterPatients} from "../../helpers/patient-search";
import {debounce} from "lodash";

const {Option} = Select;

interface PatientSectionContentProps {
    onChange: (patient: Patient | undefined) => void;
}

const PatientSectionContent = (props: PatientSectionContentProps) => {
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [{selectedPatient: globalPatient}, {changeSelectedPatient}] = usePatients();

    const onPatientChange = (patientName: string, option: any) => {
        if (option.patient)
            props.onChange(option.patient);
        changeSelectedPatient(option.patient)
    };

    useEffect(() => {
        props.onChange(globalPatient);
    }, [globalPatient])

    return (
        <AutoComplete
            value={globalPatient ? globalPatient.Name : undefined}
            placeholder='Wyszukaj pacjenta'
            onSearch={debounce((searchPhrase) => {
                setFilteredPatients(filterPatients(searchPhrase, mockPatients))
            }, 250)}
            onChange={onPatientChange}
        >
            {filteredPatients.map((x) => {
                return (
                    <Option patient={x} key={x.Id} value={x.Name}>
                        {x.Name}
                    </Option>
                );
            })}
        </AutoComplete>
    );
};

export const PatientSection = () => {
    return (
        <Form.Item
            name='patient'
            rules={[{required: true, message: 'Proszę wybrać pacjenta'}]}>
            <PatientSectionContent onChange={() => {
            }}/>
        </Form.Item>
    );
};