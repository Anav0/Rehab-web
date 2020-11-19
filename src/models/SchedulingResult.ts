import {TreatmentSolutionVariant} from './TreatmentSolutionVariant';

export class SchedulingResult {
    TreatmentSolutionVariants: TreatmentSolutionVariant[];

    constructor(TreatmentSolutionVariants: TreatmentSolutionVariant[]) {
        this.TreatmentSolutionVariants = TreatmentSolutionVariants;
    }
}