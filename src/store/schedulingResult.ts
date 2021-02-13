import { createHook, createStore } from "react-sweet-state";
import { BlocksApi } from "../api/blocksApi";
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
    acceptBlocksWithIds: (ids: string[]) => ({ setState, getState }) => {
      let tmp = getState().acceptedBlocks;

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];

        if (tmp.has(id)) continue;
        tmp.add(id);
      }

      setState({
        acceptedBlocks: new Set(tmp),
      });
    },
    removeBlocksWithIds: (ids: string[]) => ({ setState, getState }) => {
      let tmp = getState().acceptedBlocks;

      for (let i = 0; i < ids.length; i++) {
        tmp.delete(ids[i]);
      }

      setState({
        acceptedBlocks: new Set(tmp),
      });
    },

    acceptAll: () => ({ setState, getState }) => {
      const allIds = new Set<string>();
      const schedulingResult = getState().schedulingResult;

      for (let i = 0; i < schedulingResult.Solutions.length; i++) {
        const solution = schedulingResult.Solutions[i];
        for (let k = 0; k < solution.BlockIds.length; k++) {
          allIds.add(solution.BlockIds[k]);
        }
      }
      setState({
        acceptedBlocks: allIds,
      });
    },
    removeAll: () => ({ setState, getState }) => {
      setState({
        acceptedBlocks: new Set(),
      });
    },
    clear: () => ({ setState, getState }) => {
      setState({
        acceptedBlocks: new Set(),
        schedulingResult: undefined,
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
