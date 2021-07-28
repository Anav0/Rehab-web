import { writable } from "svelte/store";
import type { ReferralFilter } from "../models/referralFilter";

let baseDate = new Date();
baseDate.setDate(baseDate.getDate() - 30);
let startDate = baseDate;
let endDate = new Date();
export const referralFilter = writable<ReferralFilter>({
  endDate,
  startDate,
  status: null,
});
