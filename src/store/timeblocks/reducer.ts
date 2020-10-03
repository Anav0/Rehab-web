import { existingBlocks, generateTimeBlockRange } from "../../mock/timeBlocks";
import { TimeBlockActionType, TimeBlockState } from "./types";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";

let split = defaultBlocksConfig.startHour.split(":");
let startHour = +split[0];
let startMinutes = +split[1];

let now = new Date();
now.setDate(now.getDate() + 1);
now.setHours(startHour, startMinutes, 0, 0);
let then = new Date();
then.setDate(now.getDate() + defaultBlocksConfig.endSearchAfterDays);
then.setHours(startHour, startMinutes, 0, 0);

const initialState: TimeBlockState = {
  timeBlocks: generateTimeBlockRange(now, then, existingBlocks),
};

export const timeblockReducer = (
  state = initialState,
  action: TimeBlockActionType
): TimeBlockState => {
  switch (action.type) {
    case "ADD_TIMEBLOCK":
      state.timeBlocks = [...state.timeBlocks, action.payload];
      return { ...state };
    case "FILL_TIMEBLOCK":
      for (let timeBlock of action.payload) {
        let blockToChangeIndex = state.timeBlocks.findIndex(
          (x) => x.StartDate.getTime() === timeBlock.StartDate.getTime()
        );
        state.timeBlocks[blockToChangeIndex] = timeBlock;
      }
      return { ...state };
    case "UPDATE_TIMEBLOCK":
      let index = state.timeBlocks.findIndex(
        (block) =>
          block.StartDate.getTime() === action.payload.StartDate.getTime()
      );
      if (index === undefined || index == -1)
        state.timeBlocks.push(action.payload);
      state.timeBlocks[index] = action.payload;
      return { ...state };
    default:
      return state;
  }
};
