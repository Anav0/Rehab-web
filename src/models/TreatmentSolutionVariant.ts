import {Solution} from "./solution";
import {Recommendation} from "./recommendation";

export class TreatmentSolutionVariant {
    Recommendation: Recommendation
    Solutions: any

    constructor(Recommendation: Recommendation, Solutions: any) {
        this.Recommendation = Recommendation;
        this.Solutions = Solutions;
    }
}