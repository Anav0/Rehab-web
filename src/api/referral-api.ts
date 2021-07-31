import type { Referral } from "../models/referral";
import type { ReferralFilter } from "../models/referralFilter";
import type { Status } from "../models/status";
import { BaseApi } from "./baseApi";

export class ReferralApi extends BaseApi {
  referrals(data: ReferralFilter) {
    return this.instance.post<Referral[]>(`/referral/range`, data);
  }
}
