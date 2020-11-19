import {getNumberInRange, getRandomElement} from '.';
import {Appointment} from '../models/appointment';
import {TimeBlock} from '../models/timeBlock';
import patients from '../mock/patients';
import {TreatmentSite} from '../models/treatmentSite';

export class BlockPopulator {
    static populate(timeBlocks: TimeBlock[]) {
        let dates = [
            {
                start: new Date(2020, 10, 2, 0, 0, 0).getTime(),
                end: new Date(2020, 10, 2, 10, 0, 0).getTime(),
            },
            {
                start: new Date(2020, 10, 2, 13, 0, 0).getTime(),
                end: new Date(2020, 10, 2, 14, 0, 0).getTime(),
            },
            {
                start: new Date(2020, 10, 3, 6, 0, 0).getTime(),
                end: new Date(2020, 10, 3, 11, 0, 0).getTime(),
            },
            {
                start: new Date(2020, 10, 5, 0, 0, 1).getTime(),
                end: new Date(2020, 10, 8, 23, 59, 59).getTime(),
            },
        ];

        let stopAfter = new Date(2020, 11, 1, 23, 59, 59).getTime();

        for (let i = 0; i < timeBlocks.length; i++) {
            const block = timeBlocks[i];
            const startTime = block.StartDate.getTime();

            if (startTime >= stopAfter) break;

            let shouldSkip = true;
            for (let pair of dates) {
                if (startTime >= pair.start && startTime <= pair.end) {
                    shouldSkip = false;
                    break;
                }
            }

            if (shouldSkip) continue;

            for (let j = 0; j < block.Sites.length; j++) {
                const site = block.Sites[j];

                let capacity = Object.values(site.Capacity);
                let acceptedTreatmentsIds = Object.keys(site.Capacity);

                while (capacity.filter((x) => x > 0).length >= 1) {
                    capacity = Object.values(site.Capacity);

                    site.tryAddingAppointment(
                        new Appointment(
                            getRandomElement(acceptedTreatmentsIds),
                            getRandomElement(patients),
                        ),
                    );
                }
            }
        }
    }

    static populateRandomly(
        timeBlocks: TimeBlock[],
        maxAppointPerBlock: number = 4,
        chances: number = 0.65,
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
                            getRandomElement(patients),
                        ),
                    );
                    k--;
                }
            }
        }
    }
}
