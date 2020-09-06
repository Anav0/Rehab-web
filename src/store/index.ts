import { patientReducer } from "./patients/reducer";
import { timeblockReducer } from "./timeblocks/reducer";
import { selectedDateReducer } from "./selectedDate/reducer";
import { appointmentsReducer } from "./appointments/reducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  patients: patientReducer,
  timeBlocks: timeblockReducer,
  selectedDate: selectedDateReducer,
  appointments: appointmentsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
