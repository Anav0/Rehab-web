import {Patient} from "../models/patient";
import patients from "../mock/patients";
import {createHook, createStore} from "react-sweet-state";

type PatientsState = {
    patients: Patient[]
    selectedPatient: Patient | undefined
}

const initialState: PatientsState = {
    patients,
    selectedPatient: patients[0]
}

const store = createStore({
    initialState,
    actions: {
        changeSelectedPatient: (patient: Patient | undefined) => ({setState}) => {
            setState({
                selectedPatient: patient
            })
        },
        insertPatients: (patients: Patient[]) => ({setState}) => {
            setState({
                patients
            });
        },
    }
})

export const usePatients = createHook(store);
