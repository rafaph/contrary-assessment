import { injectable, unmanaged } from "inversify";
import { ZodType } from "zod";

import { Middleware } from "@/infra/http/interfaces/middleware";
import { Request } from "@/infra/http/interfaces/request";
import { Response } from "@/infra/http/interfaces/response";

@injectable()
export class ValidatorMiddleware implements Middleware {
  public constructor(
    @unmanaged()
    private readonly schema: ZodType,
    @unmanaged()
    private readonly requestKey: keyof Request,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const result = this.schema.safeParse(request[this.requestKey]);

    if (!result.success) {
      return Response.badRequest(result.error.formErrors.fieldErrors);
    }

    return Response.ok(result.data);
  }
}
