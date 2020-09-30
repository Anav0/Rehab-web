export interface Constraint {
    Type: string,
    Text: string,
}

export const constraints: Constraint[] = [
    {
        Type: "proximity",
        Text: "Odległość"
    }
]

export interface RawConstraint {
    Type: string,
}