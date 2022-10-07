import { z } from "zod";

export const ConfigSchema = z
  .object({
    env: z.enum(["development", "production", "test"]),
    port: z.number(),
    host: z.string().trim(),
    db: z
      .object({
        url: z.string().trim().url(),
        pool: z.object({
          min: z.number().min(1),
          max: z.number().min(1),
        }),
      })
      .strict(),
  })
  .strict();

export type ConfigType = z.infer<typeof ConfigSchema>;
