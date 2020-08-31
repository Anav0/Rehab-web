import { Solution } from "./solution";

export class ApiResult {
  solutions: Solution[];

  constructor(solutions: Solution[]) {
    this.solutions = solutions;
  }
}
