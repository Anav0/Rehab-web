import { ApiPayload } from "../models/apiPayload";
import { BaseApi } from "./baseApi";
import { SchedulingResult } from "../models/SchedulingResult";

export class FindApi extends BaseApi {
  solution(payload: ApiPayload) {
    return this.instance.post<SchedulingResult>("/", payload);
  }

  confirm(payload: SchedulingResult) {
    return this.instance.post<SchedulingResult>("/confirm", payload);
  }
}
