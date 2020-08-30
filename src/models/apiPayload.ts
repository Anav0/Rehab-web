import { PatientWish } from "./patientWish";
import { TimeBlock } from "./timeBlock";

export class ApiPayload {
  blocks: TimeBlock[];
  constraints: any[];
  preferences: any[];
  patientWish: PatientWish;

  constructor(
    blocks: TimeBlock[],
    constraints: any[],
    preferences: any[],
    patientWish: PatientWish
  ) {
    this.blocks = blocks;
    this.constraints = constraints;
    this.preferences = preferences;
    this.patientWish = patientWish;
  }
}
