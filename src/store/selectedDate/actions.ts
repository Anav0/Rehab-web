import { UPDATE_DATE, SelectedDateActionType } from "./types";

export const updateSelectedDate = (date: Date): SelectedDateActionType => {
  return {
    type: UPDATE_DATE,
    payload: date,
  };
};
