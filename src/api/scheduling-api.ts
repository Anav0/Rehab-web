import { BaseApi } from "@/api/baseApi";
import type { Proposition, SchedulingPayload } from "@/api/payload-models";

export class SchedulingApi extends BaseApi {
  proposition(request: SchedulingPayload) {
    return this.instance.post<Proposition>(
      `/proposition`,
      request
    );
  }
}
