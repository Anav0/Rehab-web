import {Proposition} from "../models/Proposition";
import {PropositionPayload} from "../models/propositionPayload";
import {BaseApi} from "./baseApi";

export class FindApi extends BaseApi {
    solution(payload: PropositionPayload) {
        return this.instance.post<Proposition>("/proposition", payload).then(response => {
            let data = response.data;
            data.ScheduledDates = data.ScheduledDates.map(dates => dates.map(date => +new Date(date)));
            return data;
        });
    }

    confirm(payload: Proposition) {
        return this.instance.post<Proposition>("/confirm", payload);
    }
}
