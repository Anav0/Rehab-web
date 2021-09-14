import type { Term } from "@models/term";

export class PropositionHelpers {
    Terms: Term[] = [];
    TermsByDayStr: Map<string, Term[][]> = new Map();
    IdsOfFirstTerms: Set<number> = new Set();
}