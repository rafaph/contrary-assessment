import { injectable } from "inversify";
import { Result } from "oxide.ts";

import { GetInvestorsRepository } from "@/domain/repositories/get-investors-repository";

export interface GetInvestorsUseCaseOutput {
  investors: string[];
}

@injectable()
export class GetInvestorsUseCase {
  public constructor(private readonly repository: GetInvestorsRepository) {}

  public async execute(
    linkedinName: string,
  ): Promise<Result<GetInvestorsUseCaseOutput, Error>> {
    const option = await this.repository.getInvestors(linkedinName);

    return option
      .map<GetInvestorsUseCaseOutput>((investors) => ({ investors }))
      .okOr(new Error("company not found"));
  }
}
