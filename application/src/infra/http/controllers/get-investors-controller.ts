import { inject, injectable } from "inversify";

import { GetInvestorsUseCase } from "@/application/get-investors-use-case";
import { GetByParamController } from "@/infra/http/controllers/get-by-param-controller";

@injectable()
export class GetInvestorsController extends GetByParamController<GetInvestorsUseCase> {
  public constructor(
    @inject(GetInvestorsUseCase)
    useCase: GetInvestorsUseCase,
  ) {
    super(useCase, "linkedinName");
  }
}
