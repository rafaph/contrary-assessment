import { Container } from "inversify";
import { Pool } from "pg";

import { GetAvgTotalFundingUseCase } from "@/application/get-avg-total-funding-use-case";
import { GetCompaniesUseCase } from "@/application/get-companies-use-case";
import { GetInvestorsUseCase } from "@/application/get-investors-use-case";
import { Config } from "@/config/config";
import { ExistsPersonIdRepository } from "@/domain/repositories/exists-person-id-repository";
import { GetAvgTotalFundingRepository } from "@/domain/repositories/get-avg-total-funding-repository";
import { GetCompaniesRepository } from "@/domain/repositories/get-companies-repository";
import { GetInvestorsRepository } from "@/domain/repositories/get-investors-repository";
import { CeroServer } from "@/external/http/cero/cero-server";
import { GetAvgTotalFundingController } from "@/infra/http/controllers/get-avg-total-funding-controller";
import { GetCompaniesController } from "@/infra/http/controllers/get-companies-controller";
import { GetInvestorsController } from "@/infra/http/controllers/get-investors-controller";
import { GetStatusController } from "@/infra/http/controllers/get-status-controller";
import { Server } from "@/infra/http/interfaces/server";
import { GetByLinkedinNameValidatorMiddleware } from "@/infra/http/middlewares/get-by-linkedin-name-validator-middleware";
import { GetByPersonIdValidatorMiddleware } from "@/infra/http/middlewares/get-by-person-id-validator-middleware";
import { PgExistsPersonIdRepository } from "@/infra/repositories/pg/pg-exists-person-id-repository";
import { PgGetAvgTotalFundingRepository } from "@/infra/repositories/pg/pg-get-avg-total-funding-repository";
import { PgGetCompaniesRepository } from "@/infra/repositories/pg/pg-get-companies-repository";
import { PgGetInvestorsRepository } from "@/infra/repositories/pg/pg-get-investors-repository";

export const makeContainer = (): Container => {
  const container = new Container();
  // config
  container.bind<Config>(Config).toSelf().inSingletonScope();
  const config = container.get<Config>(Config);
  // database connection
  container.bind<Pool>(Pool).toConstantValue(
    new Pool({
      connectionString: config.db.url,
      min: config.db.pool.min,
      max: config.db.pool.max,
    }),
  );
  // repositories
  container
    .bind<GetAvgTotalFundingRepository>(GetAvgTotalFundingRepository)
    .to(PgGetAvgTotalFundingRepository)
    .inSingletonScope();
  container
    .bind<GetCompaniesRepository>(GetCompaniesRepository)
    .to(PgGetCompaniesRepository)
    .inSingletonScope();
  container
    .bind<GetInvestorsRepository>(GetInvestorsRepository)
    .to(PgGetInvestorsRepository)
    .inSingletonScope();
  container
    .bind<ExistsPersonIdRepository>(ExistsPersonIdRepository)
    .to(PgExistsPersonIdRepository)
    .inSingletonScope();
  // use cases
  container
    .bind<GetAvgTotalFundingUseCase>(GetAvgTotalFundingUseCase)
    .toSelf()
    .inSingletonScope();
  container
    .bind<GetCompaniesUseCase>(GetCompaniesUseCase)
    .toSelf()
    .inSingletonScope();
  container
    .bind<GetInvestorsUseCase>(GetInvestorsUseCase)
    .toSelf()
    .inSingletonScope();
  // middlewares
  container
    .bind<GetByLinkedinNameValidatorMiddleware>(
      GetByLinkedinNameValidatorMiddleware,
    )
    .toSelf()
    .inSingletonScope();
  container
    .bind<GetByPersonIdValidatorMiddleware>(GetByPersonIdValidatorMiddleware)
    .toSelf()
    .inSingletonScope();
  // controllers
  container
    .bind<GetStatusController>(GetStatusController)
    .toSelf()
    .inSingletonScope();
  container
    .bind<GetAvgTotalFundingController>(GetAvgTotalFundingController)
    .toSelf()
    .inSingletonScope();
  container
    .bind<GetCompaniesController>(GetCompaniesController)
    .toSelf()
    .inSingletonScope();
  container
    .bind<GetInvestorsController>(GetInvestorsController)
    .toSelf()
    .inSingletonScope();
  // external
  container.bind<Server>(Server).to(CeroServer).inSingletonScope();
  // container
  container.bind<Container>(Container).toConstantValue(container);
  return container;
};
