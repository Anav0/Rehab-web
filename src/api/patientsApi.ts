import {BaseApi} from './baseApi';
import {Treatment} from "../models/treatment";
import {RawConstraint} from "../models/RawConstriant";
import {Patient} from "../models/patient";

export class PatientsApi extends BaseApi {
    all() {
        return this.instance.get<Patient[]>('/patients');
    }

}
