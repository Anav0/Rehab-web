export enum ConstraintType{
    SIZE,
}

export abstract class BaseConstraint {
    type: ConstraintType

    protected constructor(type: ConstraintType) {
        this.type = type;
    }
}