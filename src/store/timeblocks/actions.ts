import {ADD_TIMEBLOCK, BULK_UPDATE_TIMEBLOCKS, REMOVE_TIMEBLOCK, TimeBlockActionType,} from './types';
import {TimeBlock} from '../../models/timeBlock';

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

export const fillTimeBlocks = (
    timeblocks: TimeBlock[],
): TimeBlockActionType => {
    return {
        type: BULK_UPDATE_TIMEBLOCKS,
        payload: timeblocks,
    };
};
