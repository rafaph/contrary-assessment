import { Option } from "oxide.ts";

export abstract class GetInvestorsRepository {
  public abstract getInvestors(linkedinName: string): Promise<Option<string[]>>;
}
