import { writable } from "svelte/store";
import type { ReferralFilter } from "../models/referralFilter";

export const referralFilter = writable<ReferralFilter>(null);
