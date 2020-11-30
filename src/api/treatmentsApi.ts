import {BaseApi} from './baseApi';
import {RawConstraint} from "../mock/constraints";
import {Treatment} from "../models/treatment";

export class TreatmentsApi extends BaseApi {
    asDict() {
        return this.instance.get<{ [key: string]: Treatment }>('/treatments/dict');
    }

    all() {
        return this.instance.get<Treatment[]>('/treatments');
    }

    constraints() {
        return this.instance.get<{ [key: string]: RawConstraint[] }>('/treatments/constraints');
    }
}
