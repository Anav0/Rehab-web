import { writable } from "svelte/store";
import type { Proposition, SchedulingPayload } from "../api/payload-models";

let startDate = new Date(2018, 7, 6, 6, 0, 0, 0);
let endDate = new Date(2018, 8, 30, 18, 0, 0, 0);

export const schedulingRequest = writable<SchedulingPayload>({
  Algorithm: "SA",
  End: endDate,
  Start: startDate,
  ReferralId: null,
});

export const proposition = writable<Proposition>(null);
