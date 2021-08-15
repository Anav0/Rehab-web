import { writable } from "svelte/store";
import type { Proposition, SchedulingPayload } from "@/api/payload-models";

let startDate = new Date(2018, 9, 12, 8, 0, 0, 0);
let endDate = new Date(2018, 11, 12, 18, 0, 0, 0);

export const schedulingRequest = writable<SchedulingPayload>({
  Algorithm: "SA",
  End: endDate,
  Start: startDate,
  ReferralId: null,
});

export const proposition = writable<Proposition>(null);
