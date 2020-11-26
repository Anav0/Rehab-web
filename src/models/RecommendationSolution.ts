import {Solution} from './solution';

export class RecommendationSolution {
    TreatmentId: string
    Solution: Solution

    constructor(TreatmentId: string, Solution: Solution) {
        this.TreatmentId = TreatmentId;
        this.Solution = Solution;
    }
}