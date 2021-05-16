import { TimeBlock } from "../models/timeBlock";
import { Proposition } from "../models/Proposition";
import { cloneDeep } from "lodash";

export const dateToTime = (date: Date, lang: string = "pl") => {
  return date.toLocaleTimeString(lang, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const copy = (object: any) => {
  return cloneDeep(object);
};

export function parseTimeBlocks(unparsedBlocks: any[]) {
  let timeBlocksToUpdate: TimeBlock[] = [];
  for (let block of unparsedBlocks) {
    let timeBlock = new TimeBlock(
      block.Id,
      new Date(block.StartDate),
      block.DurationInMinutes,
      block.Sites
    );
    timeBlocksToUpdate.push(timeBlock);
  }
  return timeBlocksToUpdate;
}

export function getRandomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getNumberInRange(min: number = 0, max: number = 100) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getMonday(d: Date) {
  d = new Date(d);
  let day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export const getRandomHexColor = () => {
  const randomColor = Math.floor(Math.random() * 2 ** 24)
    .toString(16)
    .padStart(6, "0");
  return `#${randomColor}`;
};

export const formatKey = (date: Date) => {
  return `${date.toDateString()} ${date.toLocaleString("pl", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export function filterTimeBlocksByDates(
  timeBlocks: TimeBlock[],
  unavailableDates: any
): TimeBlock[] {
  if (!unavailableDates) return timeBlocks;
  for (let dateRange of unavailableDates) {
    let start = new Date(dateRange[0]);
    start.setHours(5, 0, 0, 0);
    let end = new Date(dateRange[1]);
    end.setHours(235, 0, 0, 0);
    timeBlocks = timeBlocks.filter(
      (x) =>
        x.StartDate.getTime() < start.getTime() ||
        x.StartDate.getTime() > end.getTime()
    );
  }
  return timeBlocks;
}
