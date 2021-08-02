import { writable } from "svelte/store";

export const displayOnMain = writable<string>("details");
export const prevPage = writable<string>("");

displayOnMain.subscribe((value) => {
  console.log(value);
  console.log(displayOnMain);
});
