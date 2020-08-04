import {FindApi} from "./findApi";
import axios, {AxiosInstance} from "axios";

export const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})
const find = new FindApi(instance)
export default {
    find
}