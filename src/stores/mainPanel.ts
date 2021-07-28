import { writable } from "svelte/store";

export const displayOnMain = writable<string>("referral");

displayOnMain.subscribe((value) => {
  console.log(value);
  console.log(displayOnMain);
});
