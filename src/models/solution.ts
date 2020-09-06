import { TimeBlock } from "./timeBlock";
import { TreatmentSite } from "./treatmentSite";

export class Solution {
  public blocks: TimeBlock[];
  public site: TreatmentSite;

  constructor(site: TreatmentSite, blocks: TimeBlock[]) {
    this.blocks = blocks;
    this.site = site;
  }
}
