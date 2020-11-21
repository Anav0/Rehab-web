import {TimeBlock} from '../models/timeBlock';
import {SchedulingResult} from '../models/SchedulingResult';
import {cloneDeep} from 'lodash';
import mockTreatments from '../mock/treatments';
import {Treatment} from '../models/treatment';

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
    console.log(schedulingResult.TreatmentSolutionVariants.length);
    for (let variant of schedulingResult.TreatmentSolutionVariants) {
        for (let key in variant.Solutions) {
            for (let solution of variant.Solutions[key]) {
                for (let block of solution.Blocks) {
                    let timeBlock = new TimeBlock(
                        new Date(block.StartDate),
                        block.DurationInMinutes,
                        block.Sites,
                    );
                    changedBlocksStartTimes.push(timeBlock.StartDate);
                    timeBlocksToUpdate.push(timeBlock);
                }
            }
        }
    }
    console.log(changedBlocksStartTimes);
    return timeBlocksToUpdate;
}

export function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getAllTreatmentsAsDict() {
    let dict: { [key: string]: Treatment } = {};
    for (let treatment of mockTreatments) {
        dict[treatment.Id] = treatment;
    }
    return dict;
}

export function getNumberInRange(min: number = 0, max: number = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getMonday(d: Date) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

export const getRandomHexColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}