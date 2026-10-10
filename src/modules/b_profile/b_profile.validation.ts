import { z } from "zod";

const createBusinessProfileSchema = z.object({
  body: z.object({
    businessName: z.string({
      error: "Business name is required",
    }).min(2, "Business name must be at least 2 characters"),
    description: z.string().optional(),
    phone: z.string({
      error: "Phone number is required",
    }).min(6, "Invalid phone number"),
    address: z.string({
      error: "Address is required",
    }).min(3, "Address must be at least 3 characters"),
  }),
});

const updateBusinessProfileSchema = z.object({
  body: z.object({
    businessName: z.string().min(2, "Business name must be at least 2 characters").optional(),
    description: z.string().optional(),
    phone: z.string().min(6, "Invalid phone number").optional(),
    address: z.string().min(3, "Address must be at least 3 characters").optional(),
  }),
});

// DTO types — Zod schema থেকে infer করা হয়েছে
export type CreateBusinessProfileDto = z.infer<typeof createBusinessProfileSchema>["body"];
export type UpdateBusinessProfileDto = z.infer<typeof updateBusinessProfileSchema>["body"];

export const businessProfileValidation = {
  createBusinessProfileSchema,
  updateBusinessProfileSchema,
};
