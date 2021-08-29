import { writable } from "svelte/store";
import type { ReferralsRangePayload } from "@/api/payload-models";
import type { Referral } from "@/models/referral";

let startDate = new Date(2018, 9, 1, 8, 0, 0);
let endDate = new Date(2018, 9, 2, 18, 0, 0);

export const referralsRangePayload = writable<ReferralsRangePayload>({
  to: endDate,
  from: startDate,
  status: null,
  type: 101,
});

export const referralBeingScheduled = writable<Referral>(
);