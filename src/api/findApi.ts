import { ApiPayload } from "../models/apiPayload";
import { BaseApi } from "./baseApi";
import {SchedulingResult} from "../models/SchedulingResult";

export class FindApi extends BaseApi {
  treatment(payload: ApiPayload) {
    return this.instance.post<SchedulingResult>("/", payload);
  }
}
