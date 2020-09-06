import { TimeBlock } from "./timeBlock";
import {Referral} from "./referral";

export class ApiPayload {
  Blocks: TimeBlock[]
  Preferences: any[]
  Constraints: any[]
  NumberOfSolutions: number
  Referral: Referral

  constructor(Blocks: TimeBlock[], Preferences: any[], Constraints: any[], NumberOfSolutions: number, Referral: Referral) {
    this.Blocks = Blocks;
    this.Preferences = Preferences;
    this.Constraints = Constraints;
    this.NumberOfSolutions = NumberOfSolutions;
    this.Referral = Referral;
  }
}
