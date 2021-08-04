import type { Term } from "../models/term";
import type { TermRange } from "../models/term-range";
import { BaseApi } from "./baseApi";

export class TermsApi extends BaseApi {
  range(data: TermRange) {
    return this.instance.post<Term[]>(`/terms/range`, data);
  }
}
