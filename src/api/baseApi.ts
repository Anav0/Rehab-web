import {AxiosInstance} from 'axios';

export class BaseApi {
    instance: AxiosInstance;

    constructor(instance: AxiosInstance) {
        this.instance = instance;
    }
}