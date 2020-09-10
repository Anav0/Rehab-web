import {TimeBlock} from "../models/timeBlock";
import {SchedulingResult} from "../models/SchedulingResult";

export class Uuid {
    static uuidv4 = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
            c
        ) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };
}

export const dateToTime = (date: Date, lang: string = "pl") => {
    return date.toLocaleTimeString(lang, {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const copy = (object: object) => {
    return JSON.parse(JSON.stringify(object));
};

export function parseTimeBlocksFromPayload(schedulingResult: SchedulingResult) {
    let timeBlocksToUpdate: TimeBlock[] = []
    for (let variant of schedulingResult.TreatmentSolutionVariants) {
        for (let key of Object.keys(variant.Solutions)) {
            for (let solution of variant.Solutions[key]) {
                for (let block of solution.Blocks) {
                    timeBlocksToUpdate.push(new TimeBlock(new Date(block.StartDate), block.DurationInMinutes, block.Sites))
                }
            }
        }
    }
    return timeBlocksToUpdate;
}

export function getRandomElement(arr: any[]){
    return arr[Math.floor(Math.random() * arr.length)];
}