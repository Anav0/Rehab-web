export interface Constraint {
    type: string,
    text: string,
}

export const constraints: Constraint[] = [
    {
        type: "proximity",
        text: "Odległość"
    }
]