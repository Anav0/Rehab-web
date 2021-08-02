import { writable } from "svelte/store";
import type { SchedulingProposition } from "../models/proposition";
import type { SchedulingRequest } from "../models/request";

let startDate = new Date(2021, 6, 1, 6, 0, 0, 0);
let endDate = new Date(2021, 9, 1, 18, 0, 0, 0);

export const schedulingRequest = writable<SchedulingRequest>({
  Algorithm: "SA",
  End: endDate,
  ReferralId: null,
  Start: startDate,
});

export const proposition = writable<SchedulingProposition>(null);
