import type { Term } from "@/models/term";
import { BaseApi } from "@/api/baseApi";
import type { TermRangePayload, TermsUsedPayload } from "@/api/payload-models";

export class TermsApi extends BaseApi {
  range(data: TermRangePayload) {
    return this.instance.post<Term[]>(`/terms/range`, data);
  } used(data: TermsUsedPayload) {
    return this.instance.post<number[]>(`/terms/patients`, data);
  }
}
