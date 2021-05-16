import { createHook, createStore } from "react-sweet-state";
import { Treatment } from "../models/treatment";
import { getRandomHexColor } from "../helpers";

type TreatmentsState = {
  treatments: Treatment[];
  treatmentsDict: { [key: string]: Treatment };
  coloringInfo: Map<string, string>;
};

const initialState: TreatmentsState = {
  treatments: [],
  treatmentsDict: {},
  coloringInfo: new Map<string, string>(),
};

const store = createStore({
  initialState,
  actions: {
    setTreatmentsAndDict:
      (treatments: Treatment[], treatmentsDict: { [key: string]: Treatment }) =>
      (operations: any) => {
        let coloringInfo = new Map<string, string>();

        treatments.forEach((x) => {
          coloringInfo.set(x.Id, getRandomHexColor());
        });

        operations.setState({
          treatments,
          treatmentsDict,
          coloringInfo,
        });
      },
  },
});

export const useTreatments = createHook(store);
