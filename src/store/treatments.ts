import {Patient} from "../models/patient";
import patients from "../mock/patients";
import {createHook, createStore} from "react-sweet-state";
import {Treatment} from "../models/treatment";
import treatments from "../mock/treatments";

type TreatmentsState = {
    treatments: Treatment[]
}

const initialState: TreatmentsState = {
    treatments,
}

const store = createStore({
    initialState,
    actions: {}
})

export const useTreatments = createHook(store);
