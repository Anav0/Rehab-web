import {AppointmentActionType, AppointmentState} from "./types";
import mockAppointments from "../../mock/appointments";
import {Appointment} from "../../models/appointment";

const initialState: AppointmentState = {
    appointments: mockAppointments
}

export const appointmentsReducer = (state = initialState, action: AppointmentActionType): AppointmentState => {
    switch (action.type) {
        case "ADD_APPOINTMENT":
            state.appointments = [...state.appointments,action.payload];
            return {...state};
        case "FILL_APPOINTMENTS":
            state.appointments = [...action.payload];
            return {...state};
        default:
            return state
    }
}