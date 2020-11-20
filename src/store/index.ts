import {createHook, createStore} from 'react-sweet-state';
import {patientActions, patientsInitState} from "./patients";
import {timeBlocksActions, timeBlocksInitState} from "./timeBlocks";
import {selectedDataActions, selectedDateInitState} from "./selectedDate";

const store = createStore({
    initialState: {...patientsInitState, ...timeBlocksInitState, ...selectedDateInitState},
    actions: {...patientActions, ...timeBlocksActions, ...selectedDataActions}
});

export const useSweetState = createHook(store);