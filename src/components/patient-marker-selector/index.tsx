import React, {useEffect, useState} from "react";
import {AutoComplete, Select, Space} from "antd";
import {Patient} from "../../models/patient";
import mockPatients from "../../mock/patients";
import patients from "../../mock/patients";
import {useMarkers} from "../../store/markers";
import {TreatmentMarker} from "../../helpers/calendar-marking/TreatmentMarker";
import treatments, {treatmentsColors} from "../../mock/treatments";
import {MarkerWithPatient} from "../../helpers/calendar-marking/MarkerWithPatient";
import {PatientMarker} from "../../helpers/calendar-marking/PatientMarker";
import {HighlightTwoTone} from '@ant-design/icons';
const {Option} = Select;

export const MarkBasedOnPatient = () => {
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient>(patients[0]);
    const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | undefined>();
    const [, {changeMarker}] = useMarkers();
    const markers: { [key: string]: { name: string, marker: MarkerWithPatient } } = {
        "treatment": {
            name: "Zabiegi",
            marker: new TreatmentMarker("zabiegi", selectedPatient, treatments, treatmentsColors),
        },
        "patient": {
            name: "wszystko", marker: new PatientMarker("wszystko")
        },
    }

    useEffect(() => {
        console.log(selectedMarkerKey, selectedPatient.Name)
    }, [selectedMarkerKey, selectedPatient])

    const searchPatients = (searchPhrase: string) => {
        searchPhrase = searchPhrase.toLowerCase().trim();
        setFilteredPatients(mockPatients.filter((x: Patient) =>
            x.Name.toLowerCase().includes(searchPhrase),
        ));
    };

    const onMarkerChange = (key: string) => {
        setSelectedMarkerKey(key)
        if (key)
            markers[key].marker.setPatient(selectedPatient)
        changeMarker(key ? markers[key].marker : undefined)
    }

    const OnPatientSelect = (patientName: string, option: any) => {
        setSelectedPatient(option.patient)
        if (!selectedMarkerKey) return;
        onMarkerChange(selectedMarkerKey)
    };

    return (
        <Space>
            <AutoComplete
                style={{width: 160}}
                defaultValue={patients[0].Name}
                placeholder='Filtruj po pacjencie'
                onSearch={searchPatients}
                onSelect={OnPatientSelect}
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