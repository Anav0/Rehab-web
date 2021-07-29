import { writable } from "svelte/store";
import type { ReferralFilter } from "../models/referralFilter";

let startDate = new Date(2018, 9, 1, 6, 0, 0);
let endDate = new Date(2018, 9, 2, 18, 0, 0);
export const referralFilter = writable<ReferralFilter>({
  to: endDate,
  from: startDate,
  status: null,
  type: 101,
});
