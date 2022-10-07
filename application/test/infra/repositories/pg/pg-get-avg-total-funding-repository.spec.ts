import { faker } from "@faker-js/faker";

import { PgGetAvgTotalFundingRepository } from "@/infra/repositories/pg/pg-get-avg-total-funding-repository";

import { makeArray } from "@test/factories/make-array";
import { makeCompany } from "@test/factories/make-company";
import { makePerson } from "@test/factories/make-person";
import { TestDb } from "@test/helpers/test-db";
import {
  insertCompanies,
  insertCompany,
} from "@test/infra/repositories/pg/helpers/insert-company";
import {
  insertPeople,
  insertPerson,
} from "@test/infra/repositories/pg/helpers/insert-person";

describe(PgGetAvgTotalFundingRepository.name, () => {
  it("should return None when database is empty", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const repository = new PgGetAvgTotalFundingRepository(pool);
      const personId = faker.datatype.uuid();

      // when
      const result = await repository.getAvgTotalFunding(personId);

      // then
      expect(result.isNone()).to.be.true;
    });
  });

  it("should return None if all known_total_funding is null", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const company = makeCompany();
      const person = makePerson({
        company_name: company.name,
      });

      await insertCompany(pool, company);
      await insertPerson(pool, person);

      // given
      const repository = new PgGetAvgTotalFundingRepository(pool);

      // when
      const result = await repository.getAvgTotalFunding(person.person_id);

      // then
      expect(result.isNone()).to.be.true;
    });
  });

  it("should return the correct average", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const companies = makeArray(
        () =>
          makeCompany({
            known_total_funding: faker.datatype.number(),
          }),
        faker.datatype.number({ min: 4, max: 5 }),
      );
      const personId = faker.datatype.uuid();
      const people = companies.map((company) =>
        makePerson({
          company_name: company.name,
          person_id: personId,
        }),
      );
      const totalFunding = companies.reduce(
        (current, company) => current + (company.known_total_funding ?? 0),
        0,
      );
      const average = totalFunding / companies.length;
      await insertPeople(pool, people);
      await insertCompanies(pool, companies);

      // given
      const repository = new PgGetAvgTotalFundingRepository(pool);

      // when
      const result = await repository.getAvgTotalFunding(personId);

      // then
      expect(result.isSome()).to.be.true;
      expect(result.unwrap()).to.be.equals(average);
    });
  });
});
