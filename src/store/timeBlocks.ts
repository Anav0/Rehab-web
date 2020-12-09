import {defaultBlocksConfig} from "../models/timeBlockConfig";
import {existingBlocks, generateTimeBlockRange} from "../mock/timeBlocks";
import {TimeBlock} from "../models/timeBlock";
import {createHook, createStore} from "react-sweet-state";
import {copy} from "../helpers";

let split = defaultBlocksConfig.startHour.split(':');
let startHour = +split[0];
let startMinutes = +split[1];

let now = new Date();
now.setDate(now.getDate() + 1);
now.setHours(startHour, startMinutes, 0, 0);
let then = new Date();
then.setDate(now.getDate() + defaultBlocksConfig.endSearchAfterDays);
then.setHours(startHour, startMinutes, 0, 0);

export type TimeBlocksState = {
    timeBlocks: TimeBlock[]
}

const initialState: TimeBlocksState = {
    timeBlocks: generateTimeBlockRange(now, then, existingBlocks),
}

const store = createStore({
    initialState,
    actions: {
        addTimeBlocks: (timeBlock: TimeBlock) => (operations: any) => {
            let state = operations.getState()
            operations.setState({
                timeBlocks: [...state.timeBlocks, timeBlock]
            })
        },
        bulkUpdateBlocks: (blocksToUpdate: TimeBlock[]) => ({setState, getState}) => {
            let state = getState();
            let existingBlocks = copy(state.timeBlocks);
            for (let timeBlock of blocksToUpdate) {
                let blockToChangeIndex = existingBlocks.findIndex(
                    (x: TimeBlock) => x.StartDate.getTime() === timeBlock.StartDate.getTime(),
                );
                if (blockToChangeIndex === -1)
                    throw new Error('No block with this id in timeBlocks');
                existingBlocks[blockToChangeIndex] = timeBlock;
            }
            setState({
                timeBlocks: existingBlocks,
            });
        },
    }
})

export const useTimeBlocks = createHook(store);