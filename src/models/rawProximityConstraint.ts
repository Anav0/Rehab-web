import {RawConstraint} from '../mock/constraints';

export class RawProximityConstraint implements RawConstraint {
    Type: string;
    Offset: number;
    TreatmentId: string;

    constructor(Offset: number, TreatmentId: string) {
        this.Type = 'proximity';
        this.Offset = Offset;
        this.TreatmentId = TreatmentId;
    }
}