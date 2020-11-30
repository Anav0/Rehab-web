import {TimeBlock} from '../models/timeBlock';
import {SchedulingResult} from '../models/SchedulingResult';
import {cloneDeep} from 'lodash';

export const dateToTime = (date: Date, lang: string = 'pl') => {
    return date.toLocaleTimeString(lang, {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const copy = (object: any) => {
    return cloneDeep(object);
};

export function parseTimeBlocksFromPayload(schedulingResult: SchedulingResult) {
    let timeBlocksToUpdate: TimeBlock[] = [];
    let changedBlocksStartTimes = [];
    console.log(schedulingResult.Solutions.length);
    for (let solution of schedulingResult.Solutions) {
        for (let block of solution.Solution.Blocks) {
            let timeBlock = new TimeBlock(
                new Date(block.StartDate),
                block.DurationInMinutes,
                block.Sites,
            );
            changedBlocksStartTimes.push(timeBlock.StartDate);
            timeBlocksToUpdate.push(timeBlock);
        }
    }
    console.log(changedBlocksStartTimes);
    return timeBlocksToUpdate;
}

export function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getNumberInRange(min: number = 0, max: number = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getMonday(d: Date) {
    d = new Date(d);
    let day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

export const getRandomHexColor = () => {
    const randomColor = Math.floor(Math.random() * 2 ** 24).toString(16).padStart(6, '0');
    return `#${randomColor}`
}