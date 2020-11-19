import {defaultBlocksConfig} from '../models/timeBlockConfig';

export interface PresetData {
    btnTitle: string
    addDays: (options: any) => string[]
    shouldBeDisabled: (options: any, fields: any) => boolean
}

export function canAddMoreDays(fields: any): boolean {
    return fields && fields.length < 7;
}

export function getPresetBtnsData(): PresetData[] {
    return [
        {
            btnTitle: 'Pełna dowolność',
            shouldBeDisabled: (options: any, fields: any) => {
                return fields.length + 7 > 7;

            },
            addDays: (options: any) => {
                let usedDays: string[] = [];
                for (let i = 0; i <= 6; i++) {
                    usedDays.push(i + '');
                    options.add({
                        initDay: i + '',
                        startHour: defaultBlocksConfig.startHour,
                        endHour: defaultBlocksConfig.endHour,
                    });
                }
                return usedDays;
            },
        },
        {
            btnTitle: 'Przed południem',
            shouldBeDisabled: (options: any, fields: any) => {
                return fields.length + 7 > 7;
            },
            addDays: (options: any) => {
                let usedDays: string[] = [];
                for (let i = 0; i <= 6; i++) {
                    usedDays.push(i + '');
                    options.add({
                        initDay: i + '',
                        startHour: defaultBlocksConfig.startHour,
                        endHour: '12:00:00',
                    });
                }
                return usedDays;
            },
        },
        {
            btnTitle: 'Po południu',
            shouldBeDisabled: (options: any, fields: any) => {
                return fields.length + 7 > 7;
            },
            addDays: (options: any) => {
                let usedDays: string[] = [];
                for (let i = 0; i <= 6; i++) {
                    usedDays.push(i + '');
                    options.add({
                        initDay: i + '',
                        startHour: '12:00:00',
                        endHour: defaultBlocksConfig.endHour,
                    });
                }
                return usedDays;
            },
        }];
}