import {Solution} from './solution';
import {Recommendation} from './recommendation';

export class TreatmentSolutionVariant {
    Recommendation: Recommendation;
    Solutions: { [key: number]: Solution[] };

    constructor(
        Recommendation: Recommendation,
        Solutions: { [key: number]: Solution[] }) {
        this.Recommendation = Recommendation;
        this.Solutions = Solutions;
    }
}