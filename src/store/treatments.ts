import {createHook, createStore} from "react-sweet-state";
import {Treatment} from "../models/treatment";
import {getRandomHexColor} from "../helpers";

type TreatmentsState = {
    treatments: Treatment[],
    treatmentsDict: { [key: string]: Treatment },
    treatmentsColors: string[]
}

const initialState: TreatmentsState = {
    treatments: [],
    treatmentsDict: {},
    treatmentsColors: []
}

const store = createStore({
    initialState,
    actions: {
        setTreatmentsAndDict: (treatments: Treatment[], treatmentsDict: { [key: string]: Treatment }) => (operations: any) => {
            operations.setState({
                treatments,
                treatmentsDict,
                treatmentsColors: treatments.map(x => getRandomHexColor())
            })
        },
    }
})

export const useTreatments = createHook(store);
