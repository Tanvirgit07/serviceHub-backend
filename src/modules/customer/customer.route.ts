import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import { customerController } from "./customer.controller.js";

const customerRouter = Router();

// Get all customers of logged-in provider
customerRouter.get(
  "/",
  authMiddleware,
  authorize("PROVIDER"),
  customerController.getProviderCustomers
);

// Get specific customer of logged-in provider
customerRouter.get(
  "/:id",
  authMiddleware,
  authorize("PROVIDER"),
  customerController.getProviderCustomerById
);

export default customerRouter;
