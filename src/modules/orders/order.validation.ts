import { z } from "zod";
import { OrderStatus } from "../../generated/prisma/enums.js";

const createOrderSchema = z.object({
  body: z.object({
    serviceId: z.string({
      error: "Service ID is required",
    }).min(1, "Service ID cannot be empty"),
  }),
});

const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string({
      error: "Order ID is required",
    }).min(1, "Order ID cannot be empty"),
  }),
  body: z.object({
    status: z.enum([
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED,
    ], {
      error: "Invalid order status",
    }),
  }),
});

const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string({
      error: "Order ID is required",
    }).min(1, "Order ID cannot be empty"),
  }),
});

export const orderValidation = {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
};
