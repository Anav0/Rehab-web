import {TimeBlock} from './timeBlock';
import {Referral} from './referral';
import {RawConstraint} from '../mock/constraints';
import {Treatment} from './treatment';

export class ApiPayload {
    Blocks: TimeBlock[];
    Preferences: any[];
    Referral: Referral;
    TreatmentConstraints: { [key: string]: RawConstraint[] };
    AllTreatments: { [key: string]: Treatment };
    MaxTreatmentsPerDay: { [key: string]: number };

    constructor(
        Blocks: TimeBlock[],
        Preferences: any[],
        Referral: Referral,
        TreatmentConstraints: { [key: string]: RawConstraint[] } = {},
        AllTreatments: { [key: string]: Treatment },
        MaxTreatmentsPerDay: { [key: string]: number } = {},
    ) {
        this.Blocks = Blocks;
        this.Preferences = Preferences;
        this.TreatmentConstraints = TreatmentConstraints;
        this.Referral = Referral;
        this.AllTreatments = AllTreatments;
        this.MaxTreatmentsPerDay = MaxTreatmentsPerDay;
    }
}
