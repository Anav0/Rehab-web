import { ApiPayload } from "../models/apiPayload";
import { BaseApi } from "./baseApi";
import { ApiResult } from "../models/apiResult";

export class FindApi extends BaseApi {
  treatment(payload: ApiPayload) {
    return this.instance.post<ApiResult>("/", payload);
  }
}
