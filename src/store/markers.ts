import {createHook, createStore} from "react-sweet-state";
import {ICalendarCellDataMarker} from "../helpers/calendar-marking";

type MarkersState = {
    marker: ICalendarCellDataMarker | undefined
}

const initialState: MarkersState = {
    marker: undefined,
}

const store = createStore({
    initialState,
    actions: {
        changeMarker: (marker: ICalendarCellDataMarker | undefined) => ({setState}) => {
            setState({
                marker
            });
        },
    }
})

export const useMarkers = createHook(store);
