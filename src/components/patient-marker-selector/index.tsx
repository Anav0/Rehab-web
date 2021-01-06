import React, {useEffect, useState} from "react";
import {AutoComplete, Select, Space} from "antd";
import {Patient} from "../../models/patient";
import {useMarkers} from "../../store/markers";
import {TreatmentMarker} from "../../merkers/calendar-marking/markers-with-patient/TreatmentMarker";
import {MarkerWithPatient} from "../../merkers/calendar-marking/markers-with-patient/MarkerWithPatient";
import {PatientMarker} from "../../merkers/calendar-marking/markers-with-patient/PatientMarker";
import {usePatients} from "../../store/patients";
import {filterPatients} from "../../helpers/patient-search";
import {debounce} from "lodash"
import {useTreatments} from "../../store/treatments";

const {Option} = Select;

export const MarkBasedOnPatient = () => {
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | undefined>();
    const [, {changeMarker}] = useMarkers();
    const [{patients,selectedPatient: globalPatient}, {changeSelectedPatient}] = usePatients();
    const [{treatments, treatmentsColors},] = useTreatments()

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
                        setFilteredPatients(filterPatients(searchPhrase, patients))
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