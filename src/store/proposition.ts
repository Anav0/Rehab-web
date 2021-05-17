import {createHook, createStore} from "react-sweet-state";
import {Proposition} from "../models/Proposition";

type PropositionsStore = {
    proposition: Proposition;
    acceptedDates: Set<number[]>;
};

const initialState: PropositionsStore = {
    proposition: new Proposition(),
    acceptedDates: new Set<number[]>(),
};

const store = createStore({
    initialState,
    actions: {
        acceptBlocksWithDate: (date: number) => ({setState, getState}) => {
            let acceptedDates = getState().acceptedDates;
            let proposition = getState().proposition;

            proposition.ScheduledDates.forEach(dates => {
                if (dates.includes(date))
                    acceptedDates.add(dates);
            });
            setState({
                acceptedDates: new Set(acceptedDates),
            });
        },
        removeBlocksWithDate: (date: number) => ({setState, getState}) => {
            let acceptedDates = getState().acceptedDates;
            let proposition = getState().proposition;
            proposition.ScheduledDates.forEach(dates => {
                if (dates.includes(date))
                    acceptedDates.delete(dates);
            });
            setState({
                acceptedDates: new Set(acceptedDates),
            });
        },
        acceptAll: () => ({setState, getState}) => {
            const acceptedBlocksStartDates = new Set<number[]>();
            const proposition = getState().proposition;

            for (let i = 0; i < proposition.ScheduledDates.length; i++) {
                const dates = proposition.ScheduledDates[i];
                acceptedBlocksStartDates.add(dates.map(x => +x));
            }

            setState({
                acceptedDates: acceptedBlocksStartDates,
            });
        },
        removeAll: () => ({setState, getState}) => {
            setState({
                acceptedDates: new Set(),
            });
        },
        clear: () => ({setState, getState}) => {
            setState({
                acceptedDates: new Set(),
                proposition: undefined,
            });
        },
        setProposition: (proposition: Proposition) => ({setState}) => {
            setState({
                proposition,
            });
        },
    },
});

export const useProposition = createHook(store);
