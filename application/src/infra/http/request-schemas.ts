import { z, ZodType } from "zod";

const makeRequestSchema = (param: string, valueSchema: ZodType) =>
  z
    .record(z.string(), valueSchema)
    .refine((data) => !!data[param], `invalid ${param}`);

export const GetByPersonIdRequestSchema = makeRequestSchema(
  "personId",
  z.string().trim().uuid(),
);

export const GetByLinkedinNameRequestSchema = makeRequestSchema(
  "linkedinName",
  z.string().trim().min(1),
);
