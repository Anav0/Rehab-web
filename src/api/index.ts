import {FindApi} from './findApi';
import axios from 'axios';
import {TreatmentsApi} from "./treatmentsApi";

export const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});
const find = new FindApi(instance);
const treatments = new TreatmentsApi(instance);
export const api = {
    find,
    treatments
};