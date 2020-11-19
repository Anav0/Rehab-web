export class TimeBlocksConfig {
    durationInMinutes: number = 20;
    startHour: string = '6:00';
    endHour: string = '14:00';
    endSearchAfterDays: number = 30 * 6;
}

export const defaultBlocksConfig = new TimeBlocksConfig();
