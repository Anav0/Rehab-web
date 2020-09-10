import { TimeBlock } from "./timeBlock";
import { TreatmentSite } from "./treatmentSite";

export class Solution {
  public Blocks: TimeBlock[];
  public Site: TreatmentSite;

  constructor(site: TreatmentSite, blocks: TimeBlock[]) {
    this.Blocks = blocks;
    this.Site = site;
  }
}
