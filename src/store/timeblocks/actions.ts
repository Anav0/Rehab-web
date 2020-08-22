import {
  TimeBlockActionType,
  FILL_TIMEBLOCK,
  REMOVE_TIMEBLOCK,
  ADD_TIMEBLOCK,
  UPDATE_TIMEBLOCK,
} from "./types";
import { TimeBlock } from "../../models/timeBlock";

export const addTimeblock = (timeblock: TimeBlock): TimeBlockActionType => {
  return {
    type: ADD_TIMEBLOCK,
    payload: timeblock,
  };
};

export const removeTimeblock = (timeblock: TimeBlock): TimeBlockActionType => {
  return {
    type: REMOVE_TIMEBLOCK,
    payload: timeblock,
  };
};

export const updateTimeblock = (timeblock: TimeBlock): TimeBlockActionType => {
  return {
    type: UPDATE_TIMEBLOCK,
    payload: timeblock,
  };
};

export const fillTimeBlocks = (
  timeblocks: TimeBlock[]
): TimeBlockActionType => {
  return {
    type: FILL_TIMEBLOCK,
    payload: timeblocks,
  };
};
