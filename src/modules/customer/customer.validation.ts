import type { Request } from "express";

const validateCustomerId = (req: Request): string | undefined => {
  const id = req.params.id;

  if (
    typeof id !== "string" ||
    !/^[1-9]\d*$/.test(id) ||
    !Number.isSafeInteger(Number(id)) ||
    Number(id) > 2147483647
  ) {
    return "Customer ID must be a valid positive integer";
  }
};

const validateBody = (
  body: unknown,
  isUpdate: boolean,
): string | undefined => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Request body must be a JSON object";
  }

  const data = body as Record<string, unknown>;
  const allowedFields = ["name", "email", "phone"];

  if (Object.keys(data).some((key) => !allowedFields.includes(key))) {
    return "Only name, email and phone fields are allowed";
  }

  if (isUpdate && Object.keys(data).length === 0) {
    return "Provide at least one field to update";
  }

  if (!isUpdate || "name" in data) {
    if (typeof data.name !== "string" || !data.name.trim()) {
      return "Name is required and must be a non-empty string";
    }
  }

  if (!isUpdate || "email" in data) {
    if (
      typeof data.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      return "Provide a valid email address";
    }
  }

  // Prisma schema অনুযায়ী phone optional এবং nullable।
  if (
    "phone" in data &&
    data.phone !== null &&
    (typeof data.phone !== "string" || !data.phone.trim())
  ) {
    return "Phone must be a non-empty string or null";
  }
};

const createCustomer = (req: Request) => {
  return validateBody(req.body, false);
};

const updateCustomer = (req: Request) => {
  return validateBody(req.body, true);
};

export const customerValidation = {
  validateCustomerId,
  createCustomer,
  updateCustomer,
};