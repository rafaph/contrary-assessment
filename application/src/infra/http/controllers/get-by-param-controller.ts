import { injectable, unmanaged } from "inversify";
import { Result } from "oxide.ts";

import { Controller } from "@/infra/http/interfaces/controller";
import { Request } from "@/infra/http/interfaces/request";
import { Response } from "@/infra/http/interfaces/response";

@injectable()
export class GetByParamController<
  T extends { execute: (param: string) => Promise<Result<unknown, Error>> },
> implements Controller
{
  public constructor(
    @unmanaged()
    private readonly useCase: T,
    @unmanaged()
    private readonly param: string,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const value = request.params[this.param];
    const result = await this.useCase.execute(value);

    return result
      .map((output) => Response.ok(output))
      .mapErr((err) => Response.notFound({ message: err.message }))
      .unwrapUnchecked();
  }
}
