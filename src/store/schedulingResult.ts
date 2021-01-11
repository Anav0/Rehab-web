import { createHook, createStore } from "react-sweet-state";
import { SchedulingResult } from "../models/SchedulingResult";

type PropositionsStore = {
  schedulingResult: SchedulingResult;
  acceptedBlocks: Set<string>;
};

const initialState: PropositionsStore = {
  schedulingResult: new SchedulingResult(),
  acceptedBlocks: new Set(),
};

const store = createStore({
  initialState,
  actions: {
    removeAcceptedProposition: (id: string) => ({ setState, getState }) => {
      let tmp = getState().acceptedBlocks;
      tmp.delete(id);
      setState({
        acceptedBlocks: new Set(tmp),
      });
    },
    addAcceptedProposition: (id: string) => ({ setState, getState }) => {
      let tmp = getState().acceptedBlocks;
      tmp.add(id);
      setState({
        acceptedBlocks: new Set(tmp),
      });
    },
    setSchedulingResult: (schedulingResult: SchedulingResult) => ({
      setState,
    }) => {
      setState({
        schedulingResult,
      });
    },
  },
});

export const useSchedulingResult = createHook(store);
