import { faker } from "@faker-js/faker";
import axios from "axios";
import httpStatus from "http-status";
import parallel from "mocha.parallel";

import { routes } from "@/infra/http/routes";

import { makeArray } from "@test/factories/make-array";
import { makeCompany } from "@test/factories/make-company";
import { makePerson } from "@test/factories/make-person";
import { TestApp } from "@test/helpers/test-app";
import {
  insertCompanies,
  insertCompany,
} from "@test/infra/repositories/pg/helpers/insert-company";
import {
  insertPeople,
  insertPerson,
} from "@test/infra/repositories/pg/helpers/insert-person";

const { path } = routes[1];

const makeRequest = (baseUrl: string, personId: string) =>
  axios.get(`${baseUrl}${path}`.replace(":personId", personId), {
    validateStatus: null,
  });

parallel(`GET ${path} @e2e`, () => {
  it(`should return status ${httpStatus.BAD_REQUEST} when person id is not an uuid`, async () => {
    await new TestApp().run(async (baseUrl) => {
      // given
      const personId = faker.name.firstName();

      // when
      const response = await makeRequest(baseUrl, personId);

      // then
      expect(response.status).to.be.equals(httpStatus.BAD_REQUEST);
      expect(response.data).to.be.deep.equals({ personId: ["Invalid uuid"] });
    });
  });

  it(`should return status ${httpStatus.NOT_FOUND} when person id is not not found`, async () => {
    await new TestApp().run(async (baseUrl) => {
      // given
      const personId = faker.datatype.uuid();

      // when
      const response = await makeRequest(baseUrl, personId);

      // then
      expect(response.status).to.be.equals(httpStatus.NOT_FOUND);
      expect(response.data).to.be.deep.equals({
        message: "person id not found",
      });
    });
  });

  it(`should return status ${httpStatus.OK} with avg total funding zero when known total funding is null`, async () => {
    await new TestApp().run(async (baseUrl, pool) => {
      // given
      const company = makeCompany();
      const person = makePerson({
        company_name: company.name,
      });

      await insertPerson(pool, person);
      await insertCompany(pool, company);

      // when
      const response = await makeRequest(baseUrl, person.person_id);

      // then
      expect(response.status).to.be.equals(httpStatus.OK);
      expect(response.data).to.be.deep.equals({
        average: 0,
      });
    });
  });

  it(`should return status ${httpStatus.OK} with the correct avg total funding zero`, async () => {
    await new TestApp().run(async (baseUrl, pool) => {
      // given
      const companies = makeArray(
        () =>
          makeCompany({
            known_total_funding: faker.datatype.number(),
          }),
        faker.datatype.number({ min: 2, max: 5 }),
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

      // when
      const response = await makeRequest(baseUrl, personId);

      // then
      expect(response.status).to.be.equals(httpStatus.OK);
      expect(response.data).to.be.deep.equals({ average });
    });
  });
});
