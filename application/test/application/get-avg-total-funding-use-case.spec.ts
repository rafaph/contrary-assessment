import { faker } from "@faker-js/faker";
import { None } from "oxide.ts";
import sinon from "sinon";

import { GetAvgTotalFundingUseCase } from "@/application/get-avg-total-funding-use-case";
import { ExistsPersonIdRepository } from "@/domain/repositories/exists-person-id-repository";
import { GetAvgTotalFundingRepository } from "@/domain/repositories/get-avg-total-funding-repository";

import { ExistsPersonIdRepositoryMock } from "@test/mocks/exists-person-id-repository-mock";
import { GetAvgTotalFundingRepositoryMock } from "@test/mocks/get-avg-total-funding-repository-mock";

interface SutTypes {
  getAvgTotalFundingRepository: GetAvgTotalFundingRepository;
  existsPersonIdRepository: ExistsPersonIdRepository;
  useCase: GetAvgTotalFundingUseCase;
}

const makeSut = (sut: Partial<SutTypes> = {}): SutTypes => {
  const getAvgTotalFundingRepository =
    sut.getAvgTotalFundingRepository ?? new GetAvgTotalFundingRepositoryMock();
  const existsPersonIdRepository =
    sut.existsPersonIdRepository ?? new ExistsPersonIdRepositoryMock();

  return {
    getAvgTotalFundingRepository,
    existsPersonIdRepository,
    useCase: new GetAvgTotalFundingUseCase(
      getAvgTotalFundingRepository,
      existsPersonIdRepository,
    ),
  };
};

describe(GetAvgTotalFundingUseCase.name, () => {
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

  it("should return 0 when no average is returned", async () => {
    // given
    const getAvgTotalFundingRepository = new GetAvgTotalFundingRepositoryMock(
      None,
    );
    const { useCase } = makeSut({ getAvgTotalFundingRepository });
    const personId = faker.datatype.uuid();
    const getAvgTotalFundingSpy = sinon.spy(
      getAvgTotalFundingRepository,
      "getAvgTotalFunding",
    );

    // when
    const result = await useCase.execute(personId);

    // then
    expect(getAvgTotalFundingSpy).to.have.been.calledWith(personId);
    expect(result.isOk()).to.be.true;
    expect(result.unwrap()).to.be.deep.equals({ average: 0 });
  });

  it("should return the correct average", async () => {
    // given
    const { useCase, getAvgTotalFundingRepository } = makeSut();
    const { averageOption } =
      getAvgTotalFundingRepository as GetAvgTotalFundingRepositoryMock;
    const personId = faker.datatype.uuid();

    // when
    const result = await useCase.execute(personId);

    // then
    expect(result.isOk()).to.be.true;
    expect(result.unwrap()).to.be.deep.equals({
      average: averageOption.unwrap(),
    });
  });
});
