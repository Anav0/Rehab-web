import type { SchedulingProposition } from "../models/proposition";
import type { SchedulingRequest } from "../models/request";
import { BaseApi } from "./baseApi";

export class SchedulingApi extends BaseApi {
  proposition(proposition: SchedulingRequest) {
    return this.instance.post<SchedulingProposition>(
      `/proposition`,
      proposition
    );
  }
}
