import {BaseApi} from './baseApi';
import {BlocksRangePayload} from "../models/BlocksRangePayload";
import {TimeBlock} from "../models/timeBlock";

export class BlocksApi extends BaseApi {
    range(payload: BlocksRangePayload) {
        return this.instance.post<TimeBlock[]>('/blocks/range', payload);
    }
}
