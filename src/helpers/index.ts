import { TimeBlock } from "../models/timeBlock";
import { SchedulingResult } from "../models/SchedulingResult";
import { cloneDeep } from "lodash";
import mockTreatments from "../mock/treatments";
import { Treatment } from "../models/treatment";
import { TreatmentSite } from "../models/treatmentSite";
import { Appointment } from "../models/appointment";
import patients from "../mock/patients";

export const dateToTime = (date: Date, lang: string = "pl") => {
  return date.toLocaleTimeString(lang, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const copy = (object: any) => {
  return cloneDeep(object);
};

export function parseTimeBlocksFromPayload(schedulingResult: SchedulingResult) {
  let timeBlocksToUpdate: TimeBlock[] = [];
  console.log(schedulingResult.TreatmentSolutionVariants.length);
  for (let variant of schedulingResult.TreatmentSolutionVariants) {
    for (let key in variant.Solutions) {
      for (let solution of variant.Solutions[key]) {
        for (let block of solution.Blocks) {
          let timeBlock = new TimeBlock(
            new Date(block.StartDate),
            block.DurationInMinutes,
            block.Sites
          );
          timeBlock.IsNew = true;
          console.log(timeBlock.StartDate);
          timeBlocksToUpdate.push(timeBlock);
        }
      }
    }
  }
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

export function populateBlocks(
  timeBlocks: TimeBlock[],
  maxAppointPerBlock: number = 4,
  chances: number = 0.65
) {
  for (let i = 0; i < timeBlocks.length; i++) {
    let block = timeBlocks[i];

    if (Math.random() <= chances) {
      let k = getNumberInRange(0, maxAppointPerBlock);

      while (k > 0) {
        let randomSite = getRandomElement(block.Sites) as TreatmentSite;
        let acceptedTreatmentsIds = Object.keys(randomSite.Capacity);
        randomSite.tryAddingAppointment(
          new Appointment(
            getRandomElement(acceptedTreatmentsIds),
            getRandomElement(patients)
          )
        );
        k--;
      }
    }
  }
}
