import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import { customerController } from "./customer.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { commonValidation } from "../../middlewares/common.validation.js";

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
  validateRequest(commonValidation.paramIdSchema),
  customerController.getProviderCustomerById
);

export default customerRouter;
