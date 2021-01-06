import { createHook, createStore } from "react-sweet-state";
import { TimeBlock } from "../models/timeBlock";

type PropositionsStore = {
  blocksWithPropositions: TimeBlock[];
};

const initialState: PropositionsStore = {
  blocksWithPropositions: [],
};

const store = createStore({
  initialState,
  actions: {
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
