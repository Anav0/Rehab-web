import { TreatmentSite } from "../../models/treatmentSite";
import { Appointment } from "../../models/appointment";
import treatments from "../treatments";
import patients from "../patients";
import { TimeBlock } from "../../models/timeBlock";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";
import { emptySites } from "../sites";

const sites = [
  new TreatmentSite(
    "0",
    "Sala gimnastyczna A",
    { "0": { "1": 2 } },
    { "0": 4, "1": 0 },
    [
      new Appointment(treatments[1], patients[1]),
      new Appointment(treatments[1], patients[2]),
      new Appointment(treatments[1], patients[3]),
      new Appointment(treatments[1], patients[4]),
    ]
  ),
];

export function multiplyTemplate(
  start: Date,
  end: Date,
  endFillAfter: Date,
  template: TimeBlock
) {
  let generatedBlocks: TimeBlock[] = [];
  let current = new Date(start);

  while (current < end) {
    current.setHours(current.getHours() + 1, 0, 0, 0);
    if (current.getHours() >= 20) {
      current.setDate(current.getDate() + 1);
      current.setHours(6, 0, 0, 0);
    }

    if (current.getTime() >= endFillAfter.getTime())
      generatedBlocks.push(
        new TimeBlock(new Date(current), template.durationInSeconds, emptySites)
      );
    else
      generatedBlocks.push(
        new TimeBlock(
          new Date(current),
          template.durationInSeconds,
          template.sites
        )
      );
  }
  return generatedBlocks;
}

let now = new Date();
let end = new Date();
let endFill = new Date();
end.setDate(now.getDate() + 180);
endFill.setDate(now.getDate() + 120);

export const fullCalendar = multiplyTemplate(
  now,
  end,
  endFill,
  new TimeBlock(now, defaultBlocksConfig.duration, sites)
);
