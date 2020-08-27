import { TreatmentSite } from "../../models/treatmentSite";
import { Appointment } from "../../models/appointment";
import treatments from "../treatments";
import patients from "../patients";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";
import { TimeBlock } from "../../models/timeBlock";
import { setDatesTime } from "../timeBlocks";

const full = [
  new TreatmentSite(
    "0",
    "Sala gimnastyczna A",
    { "0": { "1": 2 } },
    { "0": 2, "1": 5 },
    [
      new Appointment(treatments[1], patients[1]),
      new Appointment(treatments[1], patients[2]),
      new Appointment(treatments[0], patients[6]),
      new Appointment(treatments[0], patients[7]),
      new Appointment(treatments[0], patients[8]),
      new Appointment(treatments[0], patients[9]),
      new Appointment(treatments[0], patients[10]),
    ]
  ),
  new TreatmentSite("1", "Sala gimnastyczna B", {}, { "0": 4 }, [
    new Appointment(treatments[1], patients[3]),
    new Appointment(treatments[1], patients[4]),
    new Appointment(treatments[1], patients[5]),
    new Appointment(treatments[1], patients[6]),
  ]),
];

const low = [
  new TreatmentSite(
    "0",
    "Sala gimnastyczna A",
    { "0": { "1": 2 } },
    { "0": 6, "1": 4 },
    [
      new Appointment(treatments[1], patients[1]),
      new Appointment(treatments[1], patients[2]),
    ]
  ),
  new TreatmentSite(
    "1",
    "Sala gimnastyczna B",
    { "0": { "1": 2 } },
    { "0": 7, "1": 2 },
    [
      new Appointment(treatments[1], patients[3]),
      new Appointment(treatments[1], patients[4]),
    ]
  ),
];

const medium = [
  new TreatmentSite(
    "0",
    "Sala gimnastyczna A",
    { "0": { "1": 2 } },
    { "0": 6, "1": 4 },
    [
      new Appointment(treatments[1], patients[1]),
      new Appointment(treatments[1], patients[2]),
      new Appointment(treatments[1], patients[3]),
      new Appointment(treatments[1], patients[4]),
      new Appointment(treatments[0], patients[5]),
      new Appointment(treatments[0], patients[6]),
    ]
  ),
];

const generateDates = (start: Date, end: Date) => {
  let dates: Date[] = [];
  while (start.getTime() < end.getTime()) {
    dates.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return dates;
};

const dates1 = generateDates(new Date(2020, 7, 31), new Date(2020, 8, 30));
const dates2 = generateDates(new Date(2020, 9, 1), new Date(2020, 11, 30));

const generateBlocks = (start: Date, end: Date, sites: TreatmentSite[]) => {
  let blocks: TimeBlock[] = [];
  let firstLoop = true;
  while (start.getTime() < end.getTime()) {
    if (!firstLoop) start.setHours(start.getHours() + 1, 0, 0, 0);
    firstLoop = false;
    if (start.getHours() >= 20) {
      start.setDate(start.getDate() + 1);
      start.setHours(6, 0, 0, 0);
    }
    blocks.push(
      new TimeBlock(new Date(start), defaultBlocksConfig.duration, [...sites])
    );
  }
  return blocks;
};

const generateSet = (
  date: Date,
  startH: number,
  endH: number,
  sites: TreatmentSite[]
) => {
  return generateBlocks(
    setDatesTime(startH, 0, 0, 0, new Date(date)),
    setDatesTime(endH, 0, 0, 0, new Date(date)),
    sites
  );
};

const generate = (dates: Date[]) => {
  let combined: TimeBlock[] = [];
  dates.forEach((date) => {
    combined.push(
      ...generateSet(date, 6, 10, low),
      ...generateSet(date, 14, 16, full),
      ...generateSet(date, 16, 19, medium)
    );
  });
  return combined;
};

const generate2 = (dates: Date[]) => {
  let combined: TimeBlock[] = [];
  dates.forEach((date) => {
    combined.push(
      ...generateSet(date, 7, 9, low),
      ...generateSet(date, 10, 11, full),
      ...generateSet(date, 12, 16, medium),
      ...generateSet(date, 16, 20, low)
    );
  });
  return combined;
};

export const complexCase: TimeBlock[] = [
  ...generate(dates1),
  ...generate2(dates2),
];
