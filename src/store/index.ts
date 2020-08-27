import { patientReducer } from "./patients/reducer";
import { timeblockReducer } from "./timeblocks/reducer";
import { selectedDateReducer } from "./selectedDate/reducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  patients: patientReducer,
  timeBlocks: timeblockReducer,
  selectedDate: selectedDateReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
