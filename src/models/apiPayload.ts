import { PatientWish } from "./patientWish";
import { TimeBlock } from "./timeBlock";

export class ApiPayload {
  blocks: TimeBlock[];
  constraints: any[];
  preferences: any[];
  patientWish: PatientWish;
  numberOfSolutions: number = 1;

  constructor(
    blocks: TimeBlock[],
    constraints: any[],
    preferences: any[],
    patientWish: PatientWish,
    numberOfSolutions: number
  ) {
    this.blocks = blocks;
    this.constraints = constraints;
    this.preferences = preferences;
    this.patientWish = patientWish;
    this.numberOfSolutions = numberOfSolutions;
  }
}
