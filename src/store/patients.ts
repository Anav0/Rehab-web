import {Patient} from "../models/patient";
import patients from "../mock/patients";
import {createHook, createStore} from "react-sweet-state";

type PatientsState = {
    patients: Patient[]
}

const initialState: PatientsState = {
    patients,
}

const store = createStore({
    initialState,
    actions: {
        insertPatients: (patients: Patient[]) => ({setState}) => {
            setState({
                patients
            });
        },
    }
})

export const usePatients = createHook(store);
