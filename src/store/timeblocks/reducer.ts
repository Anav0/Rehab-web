import { existingBlocks, generateTimeBlockRange } from "../../mock/timeBlocks";
import { TimeBlockActionType, TimeBlockState } from "./types";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";

let now = new Date();
let then = new Date();
then.setDate(now.getDate() + defaultBlocksConfig.endSearchAfterDays);
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
      state.timeBlocks = [...action.payload];
      return { ...state };
    case "UPDATE_TIMEBLOCK":
      let index = state.timeBlocks.findIndex(
        (block) =>
          block.startDate.getTime() === action.payload.startDate.getTime()
      );
      if (index === undefined || index == -1)
        state.timeBlocks.push(action.payload);
      state.timeBlocks[index] = action.payload;
      return { ...state };
    default:
      return state;
  }
};
