import { inject, injectable } from "inversify";

import { GetCompaniesUseCase } from "@/application/get-companies-use-case";
import { GetByParamController } from "@/infra/http/controllers/get-by-param-controller";

@injectable()
export class GetCompaniesController extends GetByParamController<GetCompaniesUseCase> {
  public constructor(
    @inject(GetCompaniesUseCase)
    useCase: GetCompaniesUseCase,
  ) {
    super(useCase, "personId");
  }
}
