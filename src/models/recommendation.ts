import {Treatment} from "./treatment";

export interface Recommendation {
    Treatment: Treatment,
    Repeat: number,
}