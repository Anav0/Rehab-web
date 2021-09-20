import type { Term } from "@models/term";

export class PropositionHelpers {
    TermsByDayStr: Map<string, Term[][]> = new Map();
    PosByTermId: Map<number, number> = new Map();
}