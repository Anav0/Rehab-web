import type { Referral } from "@/models/referral";
import type { Status } from "@/models/status";
import { BaseApi } from "@/api/baseApi";
import type { ReferralsRangePayload } from "@/api/payload-models";

export class ReferralApi extends BaseApi {
  referrals(data: ReferralsRangePayload) {
    return this.instance.post<Referral[]>(`/referral/range`, data);
  }
}
