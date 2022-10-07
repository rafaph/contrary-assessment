import { faker } from "@faker-js/faker";

import { GetCompaniesRepository } from "@/domain/repositories/get-companies-repository";

import { makeArray } from "@test/factories/make-array";

export class GetCompaniesRepositoryMock implements GetCompaniesRepository {
  public constructor(
    public readonly companies = makeArray(
      faker.company.name.bind(faker.company),
    ),
  ) {}

  public async getCompanies(): Promise<string[]> {
    return this.companies;
  }
}
