import { writable } from "svelte/store";
import type { SchedulingRequest } from "../models/request";

let startDate = new Date();

let baseDate = new Date();
baseDate.setDate(baseDate.getDate() + 14);
let endDate = baseDate;
export const schedulingRequest = writable<SchedulingRequest>({
  Algorithm: "SA",
  End: endDate,
  ReferralId: null,
  Start: startDate,
});
