import {Patient} from '../../models/patient';

export const ADD_PATIENT = 'ADD_PATIENT';
export const REMOVE_PATIENT = 'REMOVE_PATIENT';
export const FILL_PATIENTS = 'FILL_PATIENTS';

interface FillPatientsAction {
    type: typeof FILL_PATIENTS,
    payload: Patient[]
}

interface AddPatientAction {
    type: typeof ADD_PATIENT,
    payload: Patient
}

interface RemovePatientAction {
    type: typeof REMOVE_PATIENT,
    payload: Patient
}

export interface PatientsState {
    patients: Patient[]
}

export type PatientActionType =
    AddPatientAction
    | RemovePatientAction
    | FillPatientsAction