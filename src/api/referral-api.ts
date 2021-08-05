import type { Referral } from "../models/referral";
import type { Status } from "../models/status";
import { BaseApi } from "./baseApi";
import type { ReferralsRangePayload } from "./payload-models";

export class ReferralApi extends BaseApi {
  referrals(data: ReferralsRangePayload) {
    return this.instance.post<Referral[]>(`/referral/range`, data);
  }
}
