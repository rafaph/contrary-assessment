import { ExistsPersonIdRepository } from "@/domain/repositories/exists-person-id-repository";

export class ExistsPersonIdRepositoryMock implements ExistsPersonIdRepository {
  public constructor(public readonly personExists = true) {}

  public async exists(): Promise<boolean> {
    return this.personExists;
  }
}
