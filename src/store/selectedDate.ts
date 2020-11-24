import {createHook, createStore} from "react-sweet-state";

export type SelectedDateState = {
    selectedDate: Date
}

const date = new Date()
date.setDate(date.getDate() + 1) //TODO: Remove after today's work
export const initialState: SelectedDateState = {
    selectedDate: date
}

const store = createStore({
    initialState,
    actions: {
        updateSelectedDate: (date: Date) => ({setState}) => {
            setState({
                selectedDate: new Date(date),
            });
        },
    }
})

export const useSelectedDate = createHook(store);
