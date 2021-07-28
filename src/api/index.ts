import axios from "axios";
import { SchedulingApi } from "./scheduling-api";
import { TreatmentsApi } from "./treatment-api";

const instance = axios.create({
  baseURL: API_URL,
});

const treatments = new TreatmentsApi(instance);
const scheduling = new SchedulingApi(instance);

export const api = {
  treatments,
  scheduling,
};
