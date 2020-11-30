import {createHook, createStore} from "react-sweet-state";
import {Treatment} from "../models/treatment";

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
        setTreatments: (treatments: Treatment[]) => (operations: any) => {
            operations.setState({
                treatments
            })
        },
        setTreatmentsAndDict: (treatments: Treatment[], treatmentsDict: { [key: string]: Treatment }) => (operations: any) => {
            operations.setState({
                treatments,
                treatmentsDict
            })
        },
    }
})

export const useTreatments = createHook(store);
