import { injectable } from "inversify";
import { Err, Ok, Result } from "oxide.ts";

import { ExistsPersonIdRepository } from "@/domain/repositories/exists-person-id-repository";
import { GetCompaniesRepository } from "@/domain/repositories/get-companies-repository";

export interface GetCompaniesUseCaseOutput {
  companies: string[];
}

@injectable()
export class GetCompaniesUseCase {
  public constructor(
    private readonly getCompaniesRepository: GetCompaniesRepository,
    private readonly existsPersonIdRepository: ExistsPersonIdRepository,
  ) {}

  public async execute(
    personId: string,
  ): Promise<Result<GetCompaniesUseCaseOutput, Error>> {
    const exists = await this.existsPersonIdRepository.exists(personId);

    if (!exists) {
      return Err(new Error("person id not found"));
    }

    const companies = await this.getCompaniesRepository.getCompanies(personId);

    return Ok({ companies });
  }
}
