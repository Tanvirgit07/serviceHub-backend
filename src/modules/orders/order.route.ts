import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import { orderController } from "./order.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { orderValidation } from "./order.validation.js";

const OrderRouter = Router();

// Customer
OrderRouter.post(
  "/",
  authMiddleware,
  authorize("CUSTOMER"),
  validateRequest(orderValidation.createOrderSchema),
  orderController.createOrder
);

OrderRouter.get(
  "/my-orders",
  authMiddleware,
  authorize("CUSTOMER"),
  orderController.getMyOrders
);

OrderRouter.patch(
  "/:id/cancel",
  authMiddleware,
  authorize("CUSTOMER"),
  validateRequest(orderValidation.orderIdParamSchema),
  orderController.cancelOrder
);

// Provider
OrderRouter.get(
  "/provider-orders",
  authMiddleware,
  authorize("PROVIDER"),
  orderController.getProviderOrders
);

OrderRouter.patch(
  "/:id/status",
  authMiddleware,
  authorize("PROVIDER"),
  validateRequest(orderValidation.updateOrderStatusSchema),
  orderController.updateOrderStatus
);

// Shared
OrderRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(orderValidation.orderIdParamSchema),
  orderController.getOrderById
);

export default OrderRouter;
