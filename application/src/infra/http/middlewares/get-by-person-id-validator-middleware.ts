import { injectable } from "inversify";

import { ValidatorMiddleware } from "@/infra/http/middlewares/validator-middleware";
import { GetByPersonIdRequestSchema } from "@/infra/http/request-schemas";

@injectable()
export class GetByPersonIdValidatorMiddleware extends ValidatorMiddleware {
  public constructor() {
    super(GetByPersonIdRequestSchema, "params");
  }
}
