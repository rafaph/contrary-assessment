import { faker } from "@faker-js/faker";
import sinon from "sinon";

import { GetCompaniesUseCase } from "@/application/get-companies-use-case";
import { ExistsPersonIdRepository } from "@/domain/repositories/exists-person-id-repository";
import { GetCompaniesRepository } from "@/domain/repositories/get-companies-repository";

import { ExistsPersonIdRepositoryMock } from "@test/mocks/exists-person-id-repository-mock";
import { GetCompaniesRepositoryMock } from "@test/mocks/get-companies-repository-mock";

interface SutTypes {
  getCompaniesRepository: GetCompaniesRepository;
  existsPersonIdRepository: ExistsPersonIdRepository;
  useCase: GetCompaniesUseCase;
}

const makeSut = (sut: Partial<SutTypes> = {}): SutTypes => {
  const getCompaniesRepository =
    sut.getCompaniesRepository ?? new GetCompaniesRepositoryMock();
  const existsPersonIdRepository =
    sut.existsPersonIdRepository ?? new ExistsPersonIdRepositoryMock();

  return {
    getCompaniesRepository,
    existsPersonIdRepository,
    useCase: new GetCompaniesUseCase(
      getCompaniesRepository,
      existsPersonIdRepository,
    ),
  };
};

describe(GetCompaniesUseCase.name, () => {
  it("should return an error when a person id is not found", async () => {
    // given
    const existsPersonIdRepository = new ExistsPersonIdRepositoryMock(false);
    const { useCase } = makeSut({ existsPersonIdRepository });
    const personId = faker.datatype.uuid();
    const existsSpy = sinon.spy(existsPersonIdRepository, "exists");

    // when
    const result = await useCase.execute(personId);

    // then
    expect(existsSpy).to.have.been.calledWith(personId);
    expect(result.isErr()).to.be.true;
  });

  it("should return the correct companies list", async () => {
    // given
    const { useCase, getCompaniesRepository } = makeSut();
    const { companies } = getCompaniesRepository as GetCompaniesRepositoryMock;
    const personId = faker.datatype.uuid();
    const getCompaniesSpy = sinon.spy(getCompaniesRepository, "getCompanies");

    // when
    const result = await useCase.execute(personId);

    // then
    expect(getCompaniesSpy).to.have.been.calledWith(personId);
    expect(result.isOk()).to.be.true;
    expect(result.unwrap()).to.be.deep.equals({ companies });
  });
});
