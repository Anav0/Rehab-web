import { TimeBlock } from "../../models/timeBlock";

export const ADD_TIMEBLOCK = "ADD_TIMEBLOCK";
export const REMOVE_TIMEBLOCK = "REMOVE_TIMEBLOCK";
export const FILL_TIMEBLOCK = "FILL_TIMEBLOCK";
export const UPDATE_TIMEBLOCK = "UPDATE_TIMEBLOCK";

interface FillTimeBlockAction {
  type: typeof FILL_TIMEBLOCK;
  payload: TimeBlock[];
}

interface AddTimeBlockAction {
  type: typeof ADD_TIMEBLOCK;
  payload: TimeBlock;
}

interface UpdateTimeBlockAction {
  type: typeof UPDATE_TIMEBLOCK;
  payload: TimeBlock;
}

interface RemoveTimeBlockAction {
  type: typeof REMOVE_TIMEBLOCK;
  payload: TimeBlock;
}

export interface TimeBlockState {
  timeBlocks: TimeBlock[];
}

export type TimeBlockActionType =
  | FillTimeBlockAction
  | AddTimeBlockAction
  | UpdateTimeBlockAction
  | RemoveTimeBlockAction;
