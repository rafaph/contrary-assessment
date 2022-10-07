import { faker } from "@faker-js/faker";

import { PgGetCompaniesRepository } from "@/infra/repositories/pg/pg-get-companies-repository";

import { makeArray } from "@test/factories/make-array";
import { makePerson } from "@test/factories/make-person";
import { TestDb } from "@test/helpers/test-db";
import { insertPeople } from "@test/infra/repositories/pg/helpers/insert-person";

describe(PgGetCompaniesRepository.name, () => {
  it("should return an empty list if person id is not found", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const repository = new PgGetCompaniesRepository(pool);

      // when
      const companies = await repository.getCompanies(faker.datatype.uuid());

      // then
      expect(companies).to.be.empty;
    });
  });

  it("should return a list of companies filtering nulls", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const personId = faker.datatype.uuid();
      const people = makeArray(() =>
        makePerson({
          person_id: personId,
          company_name: faker.company.name(),
        }),
      );
      delete people[0].company_name;
      const expectedCompanies = people
        .slice(1)
        .map((person) => person.company_name);
      await insertPeople(pool, people);
      const repository = new PgGetCompaniesRepository(pool);

      // when
      const companies = await repository.getCompanies(personId);

      // then
      expect(companies).to.be.deep.equal(expectedCompanies);
    });
  });

  it("should return a list of companies", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const personId = faker.datatype.uuid();
      const people = makeArray(() =>
        makePerson({
          person_id: personId,
          company_name: faker.company.name(),
        }),
      );
      const expectedCompanies = people.map((person) => person.company_name);
      await insertPeople(pool, people);
      const repository = new PgGetCompaniesRepository(pool);

      // when
      const companies = await repository.getCompanies(personId);

      // then
      expect(companies).to.be.deep.equal(expectedCompanies);
    });
  });
});
