import type { Referral } from "@/models/referral";
import type { Term } from "@/models/term";

export class TermRangePayload {
    From: Date;
    To: Date;
    TreatmentId: string
}
export class TermsUsedPayload {
    From: Date;
    To: Date;
    PatientId: string
}
export class SchedulingPayload {
    Start: Date;
    End: Date;
    Algorithm: string;
    ReferralId: string;
}
export class ReferralsRangePayload {
    status: number;
    type: number = 101;
    from: Date;
    to: Date;
}
export class Proposition {
    Referrals: Referral[];
    ProposedTrms: Term[][];
}
