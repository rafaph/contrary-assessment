import { injectable } from "inversify";
import { Err, Ok, Result } from "oxide.ts";

import { ExistsPersonIdRepository } from "@/domain/repositories/exists-person-id-repository";
import { GetAvgTotalFundingRepository } from "@/domain/repositories/get-avg-total-funding-repository";

export interface GetAvgTotalFundingUseCaseOutput {
  average: number;
}

@injectable()
export class GetAvgTotalFundingUseCase {
  public constructor(
    private readonly getAvgTotalFundingRepository: GetAvgTotalFundingRepository,
    private readonly existsPersonIdRepository: ExistsPersonIdRepository,
  ) {}

  public async execute(
    personId: string,
  ): Promise<Result<GetAvgTotalFundingUseCaseOutput, Error>> {
    const exists = await this.existsPersonIdRepository.exists(personId);

    if (!exists) {
      return Err(new Error("person id not found"));
    }

    const avgTotalFundingOption =
      await this.getAvgTotalFundingRepository.getAvgTotalFunding(personId);

    const average = avgTotalFundingOption.unwrapOr(0);

    return Ok({ average });
  }
}
