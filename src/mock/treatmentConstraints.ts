import {RawConstraint} from "./constraints";
import {RawProximityConstraint} from "../models/rawProximityConstraint";

export let treatmentConstraints: { [key: string]: RawConstraint[] } = {
    "3": [new RawProximityConstraint(40, "4"),new RawProximityConstraint(20, "3")],
    "4": [new RawProximityConstraint(40, "3"), new RawProximityConstraint(20, "4")],
}