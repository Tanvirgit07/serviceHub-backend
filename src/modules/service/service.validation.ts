import { z } from "zod";

const createServiceSchema = z.object({
  body: z.object({
    title: z.string({
      error: "Title is required",
    }).min(3, "Title must be at least 3 characters"),
    description: z.string({
      error: "Description is required",
    }).min(10, "Description must be at least 10 characters"),
    price: z.coerce.number({
      error: "Price must be a valid number",
    }).positive("Price must be greater than 0"),
    availability: z.boolean().optional(),
  }),
});

const updateServiceSchema = z.object({
  params: z.object({
    id: z.string({
      error: "Service ID is required",
    }).min(1, "Service ID cannot be empty"),
  }),
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    price: z.coerce.number().positive("Price must be greater than 0").optional(),
    availability: z.boolean().optional(),
  }),
});

const serviceIdParamSchema = z.object({
  params: z.object({
    id: z.string({
      error: "Service ID is required",
    }).min(1, "Service ID cannot be empty"),
  }),
});

// getAllServices-এর জন্য query validation schema
// z.coerce.number() → query param string কে automatically number-এ convert করে
// z.enum + transform → "true"/"false" string কে boolean-এ convert করে
const getAllServicesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    minPrice: z.coerce.number({
      error: "minPrice must be a valid number",
    }).positive("minPrice must be greater than 0").optional(),
    maxPrice: z.coerce.number({
      error: "maxPrice must be a valid number",
    }).positive("maxPrice must be greater than 0").optional(),
    availability: z.enum(["true", "false"], {
      error: "availability must be 'true' or 'false'",
    }).transform(v => v === "true").optional(),
  }),
});

// DTO types — Zod schema থেকে infer করা হয়েছে
export type CreateServiceDto     = z.infer<typeof createServiceSchema>["body"];
export type UpdateServiceDto     = z.infer<typeof updateServiceSchema>["body"];
export type GetAllServicesQueryDto = z.infer<typeof getAllServicesSchema>["query"];

export const serviceValidation = {
  createServiceSchema,
  updateServiceSchema,
  serviceIdParamSchema,
  getAllServicesSchema,
};
