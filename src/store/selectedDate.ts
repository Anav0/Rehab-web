import {createHook, createStore} from "react-sweet-state";

export type SelectedDateState = {
    selectedDate: Date
}

export const initialState: SelectedDateState = {
    selectedDate: new Date()
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
