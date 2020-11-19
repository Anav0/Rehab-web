import {SelectedDateActionType, UPDATE_DATE} from './types';

export const updateSelectedDate = (date: Date): SelectedDateActionType => {
    return {
        type: UPDATE_DATE,
        payload: date,
    };
};
