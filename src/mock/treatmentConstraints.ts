import {RawConstraint} from "./constraints";
import {RawProximityConstraint} from "../models/rawProximityConstraint";

export let treatmentConstraints: { [key: string]: RawConstraint[] } = {
    "1": [new RawProximityConstraint(-20, "2")],
    "3": [new RawProximityConstraint(40, "4"), new RawProximityConstraint(-40, "4")],
    "4": [new RawProximityConstraint(40, "3"), new RawProximityConstraint(-40, "3")],
    "9": [new RawProximityConstraint(20, "6")],
}