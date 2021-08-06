import { BaseApi } from "./baseApi";
import type { Proposition, SchedulingPayload } from "./payload-models";

export class SchedulingApi extends BaseApi {
  proposition(request: SchedulingPayload) {
    return this.instance.post<Proposition>(
      `/proposition`,
      request
    );
  }
}
