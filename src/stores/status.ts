import { writable } from "svelte/store";
import type { Status } from "../models/status";

export const statuses = writable<Status[]>([]);
