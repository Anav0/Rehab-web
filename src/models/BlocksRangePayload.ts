export class BlocksRangePayload {
    Start: string
    End: string

    constructor(Start: string, End: string) {
        this.Start = Start;
        this.End = End;
    }
}