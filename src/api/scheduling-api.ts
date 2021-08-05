import type { PropositionPayload } from "../models/proposition";
import { BaseApi } from "./baseApi";
import type { SchedulingPayload } from "./payload-models";

export class SchedulingApi extends BaseApi {
  proposition(request: SchedulingPayload) {
    return this.instance.post<PropositionPayload>(
      `/proposition`,
      request
    );
  }
}
