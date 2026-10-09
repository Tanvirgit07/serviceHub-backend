import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { providerController } from "./provider.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { commonValidation } from "../../middlewares/common.validation.js";

const providerRouter = Router();

// Get all providers
providerRouter.get(
  "/",
  authMiddleware,
  providerController.getAllProviders
);

// Get provider by ID
providerRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(commonValidation.paramIdSchema),
  providerController.getProviderById
);

export default providerRouter;
