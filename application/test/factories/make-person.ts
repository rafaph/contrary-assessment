import { faker } from "@faker-js/faker";

import { Person } from "@test/interfaces/person";

export const makePerson = (person: Partial<Person> = {}): Person => ({
  person_id: faker.datatype.uuid(),
  ...person,
});
