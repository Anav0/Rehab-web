import {Referral} from './referral';

export class ApiPayload {
    Preferences: any[];
    Referral: Referral;

    constructor(
        Preferences: any[],
        Referral: Referral,
    ) {
        this.Preferences = Preferences;
        this.Referral = Referral;
    }
}
