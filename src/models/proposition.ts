import type { Referral } from "./referral";
import type { Term } from "./term";

export class SchedulingProposition {
  Referrals: Referral[];
  ProposedTrms: Term[][];
}
