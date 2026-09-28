import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import { orderController } from "./order.controller.js";



const OrderRouter = Router();

// Customer
OrderRouter.post(
  "/",
  authMiddleware,
  authorize("CUSTOMER"),
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
  orderController.updateOrderStatus
);

// Shared
OrderRouter.get(
  "/:id",
  authMiddleware,
  orderController.getOrderById
);

export default OrderRouter
