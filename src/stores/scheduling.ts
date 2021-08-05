import { writable } from "svelte/store";
import type { PropositionPayload, SchedulingPayload } from "../api/payload-models";

let startDate = new Date(2018, 7, 6, 6, 0, 0, 0);
let endDate = new Date(2018, 8, 30, 18, 0, 0, 0);

export const schedulingRequest = writable<SchedulingPayload>({
  Algorithm: "SA",
  End: endDate,
  ReferralId: null,
  Start: startDate,
});

export const proposition = writable<PropositionPayload>(null);
