import { BaseApi } from "./baseApi";
import { Treatment } from "../models/treatment";
import { RawConstraint } from "../models/RawConstriant";

export class TreatmentsApi extends BaseApi {
  asDict() {
    return this.instance.get<{ [key: string]: Treatment }>("/treatments/dict");
  }

  all() {
    return this.instance.get<Treatment[]>("/treatments");
  }

  constraints() {
    return this.instance.get<Map<string, RawConstraint[]>>(
      "/treatments/constraints"
    );
  }
}
