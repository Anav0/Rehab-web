import { existingBlocks } from "../../mock/timeBlocks";
import { TimeBlockActionType, TimeBlockState } from "./types";

const initialState: TimeBlockState = {
  timeBlocks: existingBlocks,
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
        (block) => block.start === action.payload.start
      );
      if (index === undefined || index == -1)
        state.timeBlocks.push(action.payload);
      state.timeBlocks[index] = action.payload;
      return { ...state };
    default:
      return state;
  }
};
