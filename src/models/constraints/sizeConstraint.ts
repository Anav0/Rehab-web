import {BaseConstraint, ConstraintType} from "./baseConstraint";

export class SizeConstraint extends BaseConstraint{
    size: number

    constructor(type: ConstraintType, size: number) {
        super(type);
        this.size = size;
    }
}