import { None } from "oxide.ts";
import sinon from "sinon";

import { GetInvestorsUseCase } from "@/application/get-investors-use-case";
import { GetInvestorsRepository } from "@/domain/repositories/get-investors-repository";

import { makeCompanyLinkedinName } from "@test/factories/make-company-linkedin-name";
import { GetInvestorsRepositoryMock } from "@test/mocks/get-investors-repository-mock";

interface SutTypes {
  getInvestorsRepository: GetInvestorsRepository;
  useCase: GetInvestorsUseCase;
}

const makeSut = (sut: Partial<SutTypes> = {}): SutTypes => {
  const getInvestorsRepository =
    sut.getInvestorsRepository ?? new GetInvestorsRepositoryMock();

  return {
    getInvestorsRepository,
    useCase: new GetInvestorsUseCase(getInvestorsRepository),
  };
};

describe(GetInvestorsUseCase.name, () => {
  it("should return an error when company is not found", async () => {
    // given
    const getInvestorsRepository = new GetInvestorsRepositoryMock(None);
    const { useCase } = makeSut({ getInvestorsRepository });
    const linkedinName = makeCompanyLinkedinName();
    const getInvestorsSpy = sinon.spy(getInvestorsRepository, "getInvestors");

    // when
    const result = await useCase.execute(linkedinName);

    // then
    expect(getInvestorsSpy).to.have.been.calledWith(linkedinName);
    expect(result.isErr()).to.be.true;
  });

  it("should return the correct investors list", async () => {
    // given
    const { useCase, getInvestorsRepository } = makeSut();
    const { investorsOption } =
      getInvestorsRepository as GetInvestorsRepositoryMock;
    const linkedinName = makeCompanyLinkedinName();
    const getInvestorsSpy = sinon.spy(getInvestorsRepository, "getInvestors");

    // when
    const result = await useCase.execute(linkedinName);

    // then
    expect(getInvestorsSpy).to.have.been.calledWith(linkedinName);
    expect(result.isOk()).to.be.true;
    expect(result.unwrap()).to.be.deep.equals({
      investors: investorsOption.unwrap(),
    });
  });
});
