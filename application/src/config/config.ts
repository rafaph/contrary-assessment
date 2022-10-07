import { injectable } from "inversify";

import { ConfigSchema, ConfigType } from "@/config/config-schema";
import { makeConfig } from "@/config/make-config";
import { Logger } from "@/lib/logger";

@injectable()
export class Config implements ConfigType {
  public readonly env!: ConfigType["env"];
  public readonly host!: ConfigType["host"];
  public readonly port!: ConfigType["port"];
  public readonly db!: ConfigType["db"];

  public constructor() {
    const result = ConfigSchema.safeParse(makeConfig());

    if (!result.success) {
      const message = "Invalid config...";

      Logger.error({ errors: result.error.errors }, message);

      throw new Error(message);
    }

    Object.assign(this as object, result.data);
  }
}
