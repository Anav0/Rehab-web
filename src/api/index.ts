import {FindApi} from './findApi';
import axios from 'axios';
import {TreatmentsApi} from "./treatmentsApi";
import {PatientsApi} from "./patientsApi";
import {BlocksApi} from "./BlocksApi";

export const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

const find = new FindApi(instance);
const treatments = new TreatmentsApi(instance);
const patients = new PatientsApi(instance);
const blocks = new BlocksApi(instance);

export const api = {
    find,
    treatments,
    patients,
    blocks
};