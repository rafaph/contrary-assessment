import { inject, injectable } from "inversify";

import { GetAvgTotalFundingUseCase } from "@/application/get-avg-total-funding-use-case";
import { GetByParamController } from "@/infra/http/controllers/get-by-param-controller";

@injectable()
export class GetAvgTotalFundingController extends GetByParamController<GetAvgTotalFundingUseCase> {
  public constructor(
    @inject(GetAvgTotalFundingUseCase)
    useCase: GetAvgTotalFundingUseCase,
  ) {
    super(useCase, "personId");
  }
}
