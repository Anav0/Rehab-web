import { patientReducer } from './patients/reducer'
import { appointmentsReducer } from './appointments/reducer'
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
    patients: patientReducer,
    appointments: appointmentsReducer
})

export type RootState = ReturnType<typeof rootReducer>