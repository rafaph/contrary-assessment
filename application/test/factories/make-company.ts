import { faker } from "@faker-js/faker";

import { Company } from "@test/interfaces/company";

export const makeCompany = (company: Partial<Company> = {}): Company => ({
  name: faker.company.name(),
  linkedin_names: [],
  investors: [],
  ...company,
});
