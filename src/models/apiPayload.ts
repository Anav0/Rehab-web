import {TimeBlock} from "./timeBlock";
import {Referral} from "./referral";
import {Constraint, RawConstraint} from "../mock/constraints";

export class ApiPayload {
    Blocks: TimeBlock[]
    Preferences: any[]
    Referral: Referral
    TreatmentConstraints: {[key: string]: RawConstraint[]}

    constructor(Blocks: TimeBlock[], Preferences: any[], Referral: Referral, TreatmentConstraints: {[key: string]: RawConstraint[]} = {}) {
        this.Blocks = Blocks;
        this.Preferences = Preferences;
        this.TreatmentConstraints = TreatmentConstraints;
        this.Referral = Referral;
    }
}
