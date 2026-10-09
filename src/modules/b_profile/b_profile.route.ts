import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import { businessProfileController } from "./b_profile.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { businessProfileValidation } from "./b_profile.validation.js";

const b_profileRouter = Router();

// Create business profile
b_profileRouter.post(
  "/",
  authMiddleware,
  authorize("PROVIDER"),
  validateRequest(businessProfileValidation.createBusinessProfileSchema),
  businessProfileController.createBusinessProfile
);

// Get my business profile
b_profileRouter.get(
  "/me",
  authMiddleware,
  authorize("PROVIDER"),
  businessProfileController.getMyBusinessProfile
);

// Update my business profile
b_profileRouter.patch(
  "/me",
  authMiddleware,
  authorize("PROVIDER"),
  validateRequest(businessProfileValidation.updateBusinessProfileSchema),
  businessProfileController.updateMyBusinessProfile
);

export default b_profileRouter;
