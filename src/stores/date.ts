import { writable } from "svelte/store";

export const dateFormat = writable<any>(
    {
        year: "numeric",
        day: "2-digit",
        month: "2-digit",

    })
