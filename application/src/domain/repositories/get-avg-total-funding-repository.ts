import { Option } from "oxide.ts";

export abstract class GetAvgTotalFundingRepository {
  public abstract getAvgTotalFunding(personId: string): Promise<Option<number>>;
}
