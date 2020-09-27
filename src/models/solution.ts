import {TimeBlock} from "./timeBlock";

export class Solution {
    public Blocks: TimeBlock[];
    public PickedSitePos: number;

    constructor(pickedSitePos: number, blocks: TimeBlock[]) {
        this.Blocks = blocks;
        this.PickedSitePos = pickedSitePos;
    }
}
