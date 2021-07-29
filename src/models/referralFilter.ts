import type { Status } from "./status";

export class ReferralFilter {
  status: number;
  type: number = 101;
  from: Date;
  to: Date;
}
