import {Patient} from '../../models/patient';
import {ADD_PATIENT, FILL_PATIENTS, PatientActionType, REMOVE_PATIENT,} from './types';

export const addPatient = (patient: Patient): PatientActionType => {
    return {
        type: ADD_PATIENT,
        payload: patient,
    };
};

export const removePatient = (patient: Patient): PatientActionType => {
    return {
        type: REMOVE_PATIENT,
        payload: patient,
    };
};

export const fillPatients = (patients: Patient[]): PatientActionType => {
    return {
        type: FILL_PATIENTS,
        payload: patients,
    };
};