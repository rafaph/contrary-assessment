import { faker } from "@faker-js/faker";

export const makeArray = <T>(
  factory: () => T,
  length = faker.datatype.number({ min: 1, max: 10 }),
): Array<T> => Array.from({ length }, factory);
