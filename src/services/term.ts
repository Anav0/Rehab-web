import type { Term } from "@models/term";

export const areOverlapping = (a: Term, b: Term) => {
    if (!a || !b) return false;

    return a.StartDate <= b.EndDate &&
        b.StartDate <= a.EndDate
}