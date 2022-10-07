import { faker } from "@faker-js/faker";
import { Option, Some } from "oxide.ts";

import { GetInvestorsRepository } from "@/domain/repositories/get-investors-repository";

import { makeArray } from "@test/factories/make-array";

export class GetInvestorsRepositoryMock implements GetInvestorsRepository {
  public constructor(
    public readonly investorsOption: Option<string[]> = Some(
      makeArray(faker.name.fullName.bind(faker.name)),
    ),
  ) {}

  public async getInvestors(): Promise<Option<string[]>> {
    return this.investorsOption;
  }
}
