import {TimeBlock} from "./timeBlock";
import {Referral} from "./referral";
import {Constraint, RawConstraint} from "../mock/constraints";
import {Treatment} from "./treatment";

export class ApiPayload {
    Blocks: TimeBlock[]
    Preferences: any[]
    Referral: Referral
    TreatmentConstraints: { [key: string]: RawConstraint[] }
    AllTreatments: { [key: string]: Treatment }

    constructor(Blocks: TimeBlock[], Preferences: any[], Referral: Referral, TreatmentConstraints: { [key: string]: RawConstraint[] } = {}, AllTreatments: { [key: string]: Treatment }) {
        this.Blocks = Blocks;
        this.Preferences = Preferences;
        this.TreatmentConstraints = TreatmentConstraints;
        this.Referral = Referral;
        this.AllTreatments = AllTreatments;
    }
}
