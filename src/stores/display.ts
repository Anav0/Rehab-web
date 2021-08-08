import { writable } from "svelte/store";

export const displayOnMain = writable<string>("result");
export const prevPage = writable<string>("");

