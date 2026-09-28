import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { providerController } from "./provider.controller.js";

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
  providerController.getProviderById
);

export default providerRouter
