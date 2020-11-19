import {SelectedDateActionType, SelectedDateState} from './types';

const initialState: SelectedDateState = {
    selectedDate: new Date(),
};

export const selectedDateReducer = (
    state = initialState,
    action: SelectedDateActionType,
): SelectedDateState => {
    switch (action.type) {
        case 'UPDATE_DATE':
            state.selectedDate = action.payload;
            return {...state};
        default:
            return state;
    }
};
