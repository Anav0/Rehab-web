import { emptySites } from "./sites";
import { TimeBlock } from "../models/timeBlock";
import { defaultBlocksConfig } from "../models/timeBlockConfig";
import { complexCase } from "./test/camplex";

export const existingBlocks = complexCase;

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
    let key = formatKey(block.start);
    blocksByDay[key] = block;
  }
  return blocksByDay;
}

export function getTimeBlockRange(
  start: Date,
  end: Date,
  existingBlocks: TimeBlock[]
) {
  let generatedBlocks: TimeBlock[] = [];
  let current = new Date(start);

  let blocksByDay = getBlocksByDay(existingBlocks);
  while (current < end) {
    current.setHours(current.getHours() + 1, 0, 0, 0);
    if (current.getHours() >= 20) {
      current.setDate(current.getDate() + 1);
      current.setHours(6, 0, 0, 0);
    }
    let key = formatKey(current);
    if (key in blocksByDay) {
      generatedBlocks.push(blocksByDay[key]);
    } else {
      generatedBlocks.push(
        new TimeBlock(new Date(current), defaultBlocksConfig.duration, [
          ...emptySites,
        ])
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
