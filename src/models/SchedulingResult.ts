import {RecommendationSolution} from './RecommendationSolution';

export class SchedulingResult {
    Solutions: RecommendationSolution[]

    constructor(Solutions: RecommendationSolution[]) {
        this.Solutions = Solutions;
    }
}