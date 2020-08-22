import { emptySites } from "./sites";
import { TimeBlock } from "../models/timeBlock";
import { defaultBlocksConfig } from "../models/timeBlockConfig";

export const existingBlocks = [
  new TimeBlock(new Date(2020, 7, 23, 6, 0, 0, 0), 3600, emptySites),
  new TimeBlock(new Date(2020, 7, 23, 7, 0, 0, 0), 3600, emptySites),
  new TimeBlock(new Date(2020, 7, 23, 8, 0, 0, 0), 3600, emptySites),
  new TimeBlock(new Date(2020, 7, 23, 9, 0, 0, 0), 3600, emptySites),
  new TimeBlock(new Date(2020, 7, 23, 10, 0, 0, 0), 3600, emptySites),
  new TimeBlock(new Date(2020, 7, 23, 11, 0, 0, 0), 3600, emptySites),
  new TimeBlock(new Date(2020, 7, 23, 12, 0, 0, 0), 3600, emptySites),
  new TimeBlock(new Date(2020, 7, 23, 13, 0, 0, 0), 3600, emptySites),
  new TimeBlock(new Date(2020, 7, 23, 14, 0, 0, 0), 3600, emptySites),
];

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
