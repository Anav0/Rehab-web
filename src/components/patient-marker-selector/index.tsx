import React, {useEffect, useState} from "react";
import {AutoComplete, Select, Space} from "antd";
import {Patient} from "../../models/patient";
import mockPatients from "../../mock/patients";
import {useMarkers} from "../../store/markers";
import {TreatmentMarker} from "../../helpers/calendar-marking/TreatmentMarker";
import treatments, {treatmentsColors} from "../../mock/treatments";
import {MarkerWithPatient} from "../../helpers/calendar-marking/MarkerWithPatient";
import {PatientMarker} from "../../helpers/calendar-marking/PatientMarker";
import {usePatients} from "../../store/patients";
import {filterPatients} from "../../helpers/patient-search";
import {debounce} from "lodash"

const {Option} = Select;

export const MarkBasedOnPatient = () => {
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | undefined>();
    const [, {changeMarker}] = useMarkers();
    const [{selectedPatient: globalPatient}, {changeSelectedPatient}] = usePatients();

    const markers: { [key: string]: { name: string, marker: MarkerWithPatient } } = {
        "treatment": {
            name: "Zabiegi",
            marker: new TreatmentMarker("zabiegi", globalPatient, treatments, treatmentsColors),
        },
        "patient": {
            name: "Wszystko", marker: new PatientMarker("wszystko")
        },
    }

    useEffect(() => {
        changeSelectedPatient(globalPatient)
        if (selectedMarkerKey)
            onMarkerChange(selectedMarkerKey)
    }, [globalPatient])

    const onMarkerChange = (key: string) => {
        setSelectedMarkerKey(key)
        if (key)
            markers[key].marker.setPatient(globalPatient)
        changeMarker(key ? markers[key].marker : undefined)
    }

    const onPatientChange = (patientName: string, option: any) => {
        changeSelectedPatient(option.patient)
        if (!selectedMarkerKey) return;
        onMarkerChange(selectedMarkerKey)
    };

    return (
        <Space>
            <AutoComplete
                style={{width: 160}}
                value={globalPatient ? globalPatient.Name : undefined}
                placeholder='Filtruj po pacjencie'
                onSearch={debounce((searchPhrase) => {
                        setFilteredPatients(filterPatients(searchPhrase, mockPatients))
                    }
                    , 250)}
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
            <Select allowClear={true} placeholder={"Rodzaj markeru"} style={{width: 160}} onChange={onMarkerChange}>
                {
                    Object.keys(markers).map(key => {
                        let marker = markers[key];
                        return (<Option value={key}>{marker.name}</Option>)
                    })
                }
            </Select>
        </Space>

    )
}