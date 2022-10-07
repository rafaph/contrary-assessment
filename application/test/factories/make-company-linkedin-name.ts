import { faker } from "@faker-js/faker";

export const makeCompanyLinkedinName = (): string =>
  faker.helpers.slugify(faker.company.name().toLowerCase());
