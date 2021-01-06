import { createHook, createStore } from "react-sweet-state";
import { TimeBlock } from "../models/timeBlock";

type PropositionsStore = {
  blocksWithPropositions: TimeBlock[];
  acceptedPropositions: Set<string>;
};

const initialState: PropositionsStore = {
  blocksWithPropositions: [],
  acceptedPropositions: new Set(),
};

const store = createStore({
  initialState,
  actions: {
    removeAcceptedProposition: (id: string) => ({ setState, getState }) => {
      let tmp = getState().acceptedPropositions;
      tmp.delete(id);
      setState({
        acceptedPropositions: new Set(tmp),
      });
    },
    addAcceptedProposition: (id: string) => ({ setState, getState }) => {
      let tmp = getState().acceptedPropositions;
      tmp.add(id);
      setState({
        acceptedPropositions: new Set(tmp),
      });
    },
    clearPropositions: () => ({ setState }) => {
      setState({
        blocksWithPropositions: [],
      });
    },
    fillPropositions: (blocksWithPropositions: TimeBlock[]) => ({
      setState,
    }) => {
      setState({
        blocksWithPropositions,
      });
    },
  },
});

export const usePropositions = createHook(store);
