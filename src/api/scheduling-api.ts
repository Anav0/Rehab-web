import { BaseApi } from "./baseApi";
import type { PropositionPayload, SchedulingPayload } from "./payload-models";

export class SchedulingApi extends BaseApi {
  proposition(request: SchedulingPayload) {
    return this.instance.post<PropositionPayload>(
      `/proposition`,
      request
    );
  }
}
