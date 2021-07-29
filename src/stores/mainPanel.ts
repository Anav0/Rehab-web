import { writable } from "svelte/store";

export const displayOnMain = writable<string>("referral");
export const prevPage = writable<string>("");

displayOnMain.subscribe((value) => {
  console.log(value);
  console.log(displayOnMain);
});
