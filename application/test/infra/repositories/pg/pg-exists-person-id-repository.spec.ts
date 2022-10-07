import { faker } from "@faker-js/faker";

import { PgExistsPersonIdRepository } from "@/infra/repositories/pg/pg-exists-person-id-repository";

import { makePerson } from "@test/factories/make-person";
import { TestDb } from "@test/helpers/test-db";
import { insertPerson } from "@test/infra/repositories/pg/helpers/insert-person";

describe(PgExistsPersonIdRepository.name, () => {
  it("should return true when a person id is found", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const person = makePerson();
      await insertPerson(pool, person);
      const repository = new PgExistsPersonIdRepository(pool);

      // when
      const exists = await repository.exists(person.person_id);

      // then
      expect(exists).to.be.true;
    });
  });

  it("should return false when a person id is not found", async () => {
    await new TestDb().run(async (pool) => {
      // given
      const repository = new PgExistsPersonIdRepository(pool);

      // when
      const exists = await repository.exists(faker.datatype.uuid());

      // then
      expect(exists).to.be.false;
    });
  });
});
