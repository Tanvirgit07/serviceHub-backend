import { z } from "zod";

const paramIdSchema = z.object({
  params: z.object({
    id: z.string({
      error: "ID parameter is required",
    }).min(1, "ID parameter cannot be empty"),
  }),
});

export const commonValidation = {
  paramIdSchema,
};

