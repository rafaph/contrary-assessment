import { faker } from "@faker-js/faker";
import { Some, Option } from "oxide.ts";

import { GetAvgTotalFundingRepository } from "@/domain/repositories/get-avg-total-funding-repository";

export class GetAvgTotalFundingRepositoryMock
  implements GetAvgTotalFundingRepository
{
  public constructor(
    public readonly averageOption: Option<number> = Some(
      faker.datatype.number({ min: 1 }),
    ),
  ) {}

  public async getAvgTotalFunding(): Promise<Option<number>> {
    return this.averageOption;
  }
}
