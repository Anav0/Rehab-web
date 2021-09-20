import type { Term } from "@models/term";

export const areOverlapping = (a: Term, b: Term) => {
    if (!a || !b) return false;

    return a.StartDate < b.EndDate &&
        b.StartDate < a.EndDate
}
export const areOverlappingTwo = (a: Term, b: Term[]) => {
    if (!a || !b) return false;

    return a.StartDate < b[b.length - 1].EndDate &&
        b[0].StartDate < a.EndDate
}

export function Ceiling(x: number, y: number) {
    return (x + y - 1) / x;
}