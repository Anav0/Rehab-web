import { BaseApi } from "./baseApi";
import { Patient } from "../models/patient";

export class PatientsApi extends BaseApi {
  all() {
    return this.instance.get<Patient[]>("/patients");
  }
  withIds(ids: string[]) {
    return this.instance.post<Patient[]>("/patients/group", ids);
  }
}
