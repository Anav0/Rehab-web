import React, {useState} from "react";
import {AutoComplete, Select} from "antd";
import {Patient} from "../../models/patient";
import mockPatients from "../../mock/patients";
import {useMarkers} from "../../store/markers";
import {PatientCellDataMarker} from "../../helpers/calendar-marking/PatientCellDataMarker";

const {Option} = Select;

export const PatientMarkerSelector = () => {
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [, {changeMarker}] = useMarkers();
    const marker: PatientCellDataMarker = new PatientCellDataMarker("Wizyty pacjenta");

    const searchPatients = (searchPhrase: string) => {
        searchPhrase = searchPhrase.toLowerCase().trim();
        setFilteredPatients(mockPatients.filter((x: Patient) =>
            x.Name.toLowerCase().includes(searchPhrase),
        ));
    };

    const onSelect = (patientName: string, option: any) => {
        marker.setPatient(option.patient)
        changeMarker(marker)
    };

    const onChange = (data: any) => {
        if (data === undefined) changeMarker(undefined)
    }

    return (
        <AutoComplete
            allowClear={true}
            placeholder='Filtruj po pacjencie'
            onSearch={searchPatients}
            onSelect={onSelect}
            onChange={onChange}
        >
            {filteredPatients.map((x) => {
                return (
                    <Option patient={x} key={x.Id} value={x.Name}>
                        {x.Name}
                    </Option>
                );
            })}
        </AutoComplete>

    )
}