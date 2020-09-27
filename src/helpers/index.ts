import {TimeBlock} from "../models/timeBlock";
import {SchedulingResult} from "../models/SchedulingResult";
import { cloneDeep } from "lodash";
import mockTreatments from "../mock/treatments";
import {Treatment} from "../models/treatment";

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

export const copy = (object: any) => {
    return cloneDeep(object)
};

export function parseTimeBlocksFromPayload(schedulingResult: SchedulingResult) {
    let timeBlocksToUpdate: TimeBlock[] = []
    for (let variant of schedulingResult.TreatmentSolutionVariants) {
        for (let key in variant.Solutions) {
            for (let solution of variant.Solutions[key]) {
                for (let block of solution.Blocks) {
                    let timeBlock = new TimeBlock(new Date(block.StartDate), block.DurationInMinutes, block.Sites);
                    timeBlock.IsNew = true;
                    timeBlocksToUpdate.push(timeBlock)
                }
            }
        }
    }
    return timeBlocksToUpdate;
}

export function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getAllTreatmentsAsDict(){
    let dict: {[key: string]: Treatment} = {};
    for(let treatment of mockTreatments){
        dict[treatment.Id] = treatment;
    }
    return dict;
}