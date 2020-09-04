import { existingAppointments } from "../../mock/appointments";
import { AppointmentActionType, AppointmentState } from "./types";

const initialState: AppointmentState = {
  appointments: [...existingAppointments],
};

export const appointmentsReducer = (
  state = initialState,
  action: AppointmentActionType
): AppointmentState => {
  switch (action.type) {
    case "ADD_APPOINTMENT":
      state.appointments = [...state.appointments, action.payload];
      return { ...state };
    case "UPDATE_APPOINTMENT":
      let index = state.appointments.findIndex(
        (appointment) => appointment.Id === action.payload.Id
      );
      if (index === undefined || index == -1)
        state.appointments.push(action.payload);
      state.appointments[index] = action.payload;
      return { ...state };
    default:
      return state;
  }
};
