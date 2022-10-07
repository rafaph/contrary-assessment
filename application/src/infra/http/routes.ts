import { GetAvgTotalFundingController } from "@/infra/http/controllers/get-avg-total-funding-controller";
import { GetCompaniesController } from "@/infra/http/controllers/get-companies-controller";
import { GetInvestorsController } from "@/infra/http/controllers/get-investors-controller";
import { GetStatusController } from "@/infra/http/controllers/get-status-controller";
import { Route } from "@/infra/http/interfaces/route";
import { GetByLinkedinNameValidatorMiddleware } from "@/infra/http/middlewares/get-by-linkedin-name-validator-middleware";
import { GetByPersonIdValidatorMiddleware } from "@/infra/http/middlewares/get-by-person-id-validator-middleware";

export const routes: Route[] = [
  {
    method: "GET",
    path: "/status",
    controller: GetStatusController,
  },
  {
    method: "GET",
    path: "/avg-funding-by-person/:personId",
    middlewares: [GetByPersonIdValidatorMiddleware],
    controller: GetAvgTotalFundingController,
  },
  {
    method: "GET",
    path: "/companies-by-person/:personId",
    middlewares: [GetByPersonIdValidatorMiddleware],
    controller: GetCompaniesController,
  },
  {
    method: "GET",
    path: "/investors-by-company/:linkedinName",
    middlewares: [GetByLinkedinNameValidatorMiddleware],
    controller: GetInvestorsController,
  },
];
