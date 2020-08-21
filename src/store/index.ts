import { patientReducer } from "./patients/reducer";
import { timeblockReducer } from "./timeblocks/reducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  patients: patientReducer,
  timeBlocks: timeblockReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
