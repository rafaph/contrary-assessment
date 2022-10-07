import { injectable } from "inversify";

import { ValidatorMiddleware } from "@/infra/http/middlewares/validator-middleware";
import { GetByLinkedinNameRequestSchema } from "@/infra/http/request-schemas";

@injectable()
export class GetByLinkedinNameValidatorMiddleware extends ValidatorMiddleware {
  public constructor() {
    super(GetByLinkedinNameRequestSchema, "params");
  }
}
