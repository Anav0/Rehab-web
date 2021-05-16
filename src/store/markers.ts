import {createHook, createStore} from "react-sweet-state";
import {ICalendarCellMarker} from "../markers";

type MarkersState = {
    marker: ICalendarCellMarker | undefined
}

const initialState: MarkersState = {
    marker: undefined,
}

const store = createStore({
    initialState,
    actions: {
        changeMarker: (marker: ICalendarCellMarker | undefined) => ({setState}) => {
            setState({
                marker
            });
        },
    }
})

export const useMarkers = createHook(store);
