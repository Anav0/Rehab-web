import axios from "axios";
import { ReferralApi } from "./referral-api";
import { SchedulingApi } from "./scheduling-api";
import { TermsApi } from "./terms-api";
import { TreatmentsApi } from "./treatment-api";

const instance = axios.create({
  baseURL: API_URL,
});

const treatments = new TreatmentsApi(instance);
const scheduling = new SchedulingApi(instance);
const referral = new ReferralApi(instance);
const terms = new TermsApi(instance);

export const api = {
  treatments,
  scheduling,
  referral,
  terms
};
