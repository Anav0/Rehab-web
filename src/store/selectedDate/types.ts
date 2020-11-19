export const UPDATE_DATE = 'UPDATE_DATE';

interface UpdateSelectedDate {
    type: typeof UPDATE_DATE;
    payload: Date;
}

export interface SelectedDateState {
    selectedDate: Date;
}

export type SelectedDateActionType = UpdateSelectedDate;
