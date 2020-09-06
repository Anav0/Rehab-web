import {PatientActionType, PatientsState} from "./types";
import {Patient, Sex} from "../../models/patient";
import mockPatients from "../../mock/patients";

const initialState: PatientsState = {
    patients: mockPatients
}

export const patientReducer = (state = initialState, action: PatientActionType): PatientsState => {
    switch (action.type) {
        case "ADD_PATIENT":
            state.patients.push(action.payload);
            return {...state};
        case "FILL_PATIENTS":
            state.patients = [...action.payload];
            return {...state};
        case "REMOVE_PATIENT":
            state.patients = state.patients.filter((patient: Patient)=>patient.Id!==action.payload.Id);
            return {...state};
        default:
            return state
    }
}