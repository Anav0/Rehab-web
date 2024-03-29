import type { Status } from "@/models/status";
import { BaseApi } from "@/api/baseApi";

export class TreatmentsApi extends BaseApi {
  status(type: number) {
    return this.instance.get<Status[]>(`/status?type=${type}`);
  }
}
