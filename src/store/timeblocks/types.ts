import {TimeBlock} from '../../models/timeBlock';

export const ADD_TIMEBLOCK = 'ADD_TIMEBLOCK';
export const REMOVE_TIMEBLOCK = 'REMOVE_TIMEBLOCK';
export const BULK_UPDATE_TIMEBLOCKS = 'BULK_UPDATE_TIMEBLOCKS';
export const UPDATE_TIMEBLOCK = 'UPDATE_TIMEBLOCK';

interface FillTimeBlockAction {
    type: typeof BULK_UPDATE_TIMEBLOCKS;
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
