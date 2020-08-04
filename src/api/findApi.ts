import {ApiPayload} from "../models/apiPayload";
import {BaseApi} from "./baseApi";

export class FindApi extends BaseApi {
    treatment(payload: ApiPayload) { return this.instance.post('/',payload)}
}