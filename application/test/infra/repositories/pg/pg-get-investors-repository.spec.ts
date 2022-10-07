import { faker } from "@faker-js/faker";

import { PgGetInvestorsRepository } from "@/infra/repositories/pg/pg-get-investors-repository";

import { makeArray } from "@test/factories/make-array";
import { makeCompany } from "@test/factories/make-company";
import { makeCompanyLinkedinName } from "@test/factories/make-company-linkedin-name";
import { TestDb } from "@test/helpers/test-db";
import { insertCompany } from "@test/infra/repositories/pg/helpers/insert-company";

describe(PgGetInvestorsRepository.name, () => {
  it("should return none when company linkedin name is not found", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const repository = new PgGetInvestorsRepository(pool);
      const linkedinName = faker.helpers.slugify(
        faker.company.name().toLowerCase(),
      );

      // when
      const option = await repository.getInvestors(linkedinName);

      // then
      expect(option.isNone()).to.be.true;
    });
  });

  it("should return a list of investors", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const repository = new PgGetInvestorsRepository(pool);
      const linkedinName = makeCompanyLinkedinName();
      const expectedInvestors = makeArray(faker.name.fullName.bind(faker.name));
      const company = makeCompany({
        linkedin_names: [linkedinName],
        investors: expectedInvestors,
      });
      await insertCompany(pool, company);

      // when
      const investorsOption = await repository.getInvestors(linkedinName);

      // then
      expect(investorsOption.unwrap()).to.be.deep.equal(expectedInvestors);
    });
  });

  it("should return an empty list of investors", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const repository = new PgGetInvestorsRepository(pool);
      const linkedinName = makeCompanyLinkedinName();
      const company = makeCompany({
        linkedin_names: [linkedinName],
      });
      await insertCompany(pool, company);

      // when
      const investorsOption = await repository.getInvestors(linkedinName);

      // then
      expect(investorsOption.unwrap()).to.be.empty;
    });
  });
});
