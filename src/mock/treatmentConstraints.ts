import {RawConstraint} from "./constraints";
import {RawProximityConstraint} from "../models/rawProximityConstraint";

export let treatmentConstraints: { [key: string]: RawConstraint[] } = {
    "1": [new RawProximityConstraint(120, "2")]
}