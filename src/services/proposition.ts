import type { Term } from "@models/term";

export class PropositionHelpers {
    TermsByDayStr: Map<string, Term[][]> = new Map();
    PosByTermId: Map<number, number> = new Map();
    ProposedTerms: Set<number> = new Set();
    TermsTakenByPatient: Set<number> = new Set();
}