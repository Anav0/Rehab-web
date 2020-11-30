import {TimeBlock} from './timeBlock';
import {Referral} from './referral';

export class ApiPayload {
    Blocks: TimeBlock[];
    Preferences: any[];
    Referral: Referral;

    constructor(
        Blocks: TimeBlock[],
        Preferences: any[],
        Referral: Referral,
    ) {
        this.Blocks = Blocks;
        this.Preferences = Preferences;
        this.Referral = Referral;
    }
}
