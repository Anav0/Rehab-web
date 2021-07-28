import axios from "axios";
import { TreatmentsApi } from "./treatment-api";

const instance = axios.create({
  baseURL: API_URL,
});

const treatments = new TreatmentsApi(instance);

export const api = {
  treatments,
};
