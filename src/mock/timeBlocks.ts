import { TimeBlock } from "../models/timeBlock";
import { defaultBlocksConfig } from "../models/timeBlockConfig";
import { sitesByDay } from "./sites";
import { copy } from "../helpers";

export const existingBlocks = [];

export const formatKey = (date: Date) => {
  return `${date.toDateString()} ${date.toLocaleString("pl", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

function getBlocksByDay(
  blocks: TimeBlock[]
): {
  [key: string]: TimeBlock;
} {
  let blocksByDay: {
    [key: string]: TimeBlock;
  } = {};

  for (let block of blocks) {
    let key = formatKey(block.startDate);
    blocksByDay[key] = block;
  }
  return blocksByDay;
}

export function generateTimeBlockRange(
  start: Date,
  end: Date,
  existingBlocks: TimeBlock[]
) {
  let generatedBlocks: TimeBlock[] = [];
  let current = new Date(start);

  let startHour = defaultBlocksConfig.startHour.split(":");
  let endHour = defaultBlocksConfig.endHour.split(":");
  let duration = defaultBlocksConfig.durationInMinutes;

  let endDate = new Date(start);
  endDate.setHours(+endHour[0], +endHour[1], 0);

  let blocksByDay = getBlocksByDay(existingBlocks);

  while (current < end) {
    current.setMinutes(current.getMinutes() + duration, 0, 0);

    if (current.getTime() >= endDate.getTime()) {
      current.setDate(current.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);
      current.setHours(+startHour[0], +startHour[1], 0, 0);
    }
    let key = formatKey(current);
    if (key in blocksByDay) {
      generatedBlocks.push(blocksByDay[key]);
    } else {
      let sitesFoGivenDay = copy(sitesByDay[current.getDay()]);
      generatedBlocks.push(
        new TimeBlock(new Date(current), duration, [...sitesFoGivenDay])
      );
    }
  }
  return generatedBlocks;
}

export function setDatesTime(
  h: number,
  m: number,
  s: number,
  ms: number,
  date: Date = new Date()
) {
  date.setHours(h, m, s, ms);
  return date;
}
