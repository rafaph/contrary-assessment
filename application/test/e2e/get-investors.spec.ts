import { faker } from "@faker-js/faker";
import axios from "axios";
import httpStatus from "http-status";
import parallel from "mocha.parallel";

import { routes } from "@/infra/http/routes";

import { makeArray } from "@test/factories/make-array";
import { makeCompany } from "@test/factories/make-company";
import { makeCompanyLinkedinName } from "@test/factories/make-company-linkedin-name";
import { TestApp } from "@test/helpers/test-app";
import { insertCompany } from "@test/infra/repositories/pg/helpers/insert-company";

const { path } = routes[3];

const makeRequest = (baseUrl: string, linkedinName: string) =>
  axios.get(`${baseUrl}${path}`.replace(":linkedinName", linkedinName), {
    validateStatus: null,
  });

parallel(`GET ${path} @e2e`, () => {
  it(`should return status ${httpStatus.NOT_FOUND} when company is not found`, async () => {
    await new TestApp().run(async (baseUrl) => {
      // given
      const linkedinName = makeCompanyLinkedinName();

      // when
      const response = await makeRequest(baseUrl, linkedinName);

      // then
      expect(response.status).to.be.equals(httpStatus.NOT_FOUND);
      expect(response.data).to.be.deep.equals({
        message: "company not found",
      });
    });
  });

  it(`should return status ${httpStatus.OK} with an empty list of investors`, async () => {
    await new TestApp().run(async (baseUrl, pool) => {
      // given
      const linkedinName = makeCompanyLinkedinName();
      const company = makeCompany({
        linkedin_names: [linkedinName],
      });
      await insertCompany(pool, company);

      // when
      const response = await makeRequest(baseUrl, linkedinName);

      // then
      expect(response.status).to.be.equals(httpStatus.OK);
      expect(response.data).to.be.deep.equals({
        investors: [],
      });
    });
  });

  it(`should return status ${httpStatus.OK} with a list of investors`, async () => {
    await new TestApp().run(async (baseUrl, pool) => {
      // given
      const linkedinName = makeCompanyLinkedinName();
      const expectedInvestors = makeArray(faker.name.fullName.bind(faker.name));
      const company = makeCompany({
        linkedin_names: [linkedinName],
        investors: expectedInvestors,
      });
      await insertCompany(pool, company);

      // when
      const response = await makeRequest(baseUrl, linkedinName);

      // then
      expect(response.status).to.be.equals(httpStatus.OK);
      expect(response.data).to.be.deep.equals({
        investors: expectedInvestors,
      });
    });
  });
});
