import { faker } from "@faker-js/faker";
import axios from "axios";
import httpStatus from "http-status";
import parallel from "mocha.parallel";

import { routes } from "@/infra/http/routes";

import { makeArray } from "@test/factories/make-array";
import { makePerson } from "@test/factories/make-person";
import { TestApp } from "@test/helpers/test-app";
import { insertPeople } from "@test/infra/repositories/pg/helpers/insert-person";

const { path } = routes[2];

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

  it(`should return status ${httpStatus.NOT_FOUND} when person id is not found`, async () => {
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

  it(`should return status ${httpStatus.OK} with a list  of companies filtering nulls`, async () => {
    await new TestApp().run(async (baseUrl, pool) => {
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

      // when
      const response = await makeRequest(baseUrl, personId);

      // then
      expect(response.status).to.be.equals(httpStatus.OK);
      expect(response.data).to.be.deep.equals({
        companies: expectedCompanies,
      });
    });
  });

  it(`should return status ${httpStatus.OK} with a list of companies`, async () => {
    await new TestApp().run(async (baseUrl, pool) => {
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

      // when
      const response = await makeRequest(baseUrl, personId);

      // then
      expect(response.status).to.be.equals(httpStatus.OK);
      expect(response.data).to.be.deep.equals({
        companies: expectedCompanies,
      });
    });
  });
});
