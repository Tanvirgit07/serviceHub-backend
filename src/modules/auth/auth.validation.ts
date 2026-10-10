import { z } from "zod";

const signupSchema = z.object({
  body: z.object({
    name: z.string({
      error: "Name is required",
    }).min(2, "Name must be at least 2 characters"),
    email: z.string({
      error: "Email is required",
    }).email("Invalid email address"),
    password: z.string({
      error: "Password is required",
    }).min(6, "Password must be at least 6 characters"),
    role: z.enum(["CUSTOMER", "PROVIDER"]).optional(),
  }),
});

const signinSchema = z.object({
  body: z.object({
    email: z.string({
      error: "Email is required",
    }).email("Invalid email address"),
    password: z.string({
      error: "Password is required",
    }).min(1, "Password is required"),
  }),
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      error: "Refresh token is required",
    }).min(1, "Refresh token is required"),
  }),
});

// DTO types — inferred directly from Zod schemas
// Schema পরিবর্তন হলে এই types automatically update হয়
export type SignupDto       = z.infer<typeof signupSchema>["body"];
export type SigninDto       = z.infer<typeof signinSchema>["body"];
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>["body"];

export const authValidation = {
  signupSchema,
  signinSchema,
  refreshTokenSchema,
};
