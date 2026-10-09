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

export const serviceValidation = {
  createServiceSchema,
  updateServiceSchema,
  serviceIdParamSchema,
};

