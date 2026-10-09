import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import { serviceController } from "./service.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { serviceValidation } from "./service.validation.js";

const serviceRouter = Router();

serviceRouter.post(
  "/create-service",
  authMiddleware,
  authorize("PROVIDER"),
  validateRequest(serviceValidation.createServiceSchema),
  serviceController.createService,
);

serviceRouter.get(
  "/my-services",
  authMiddleware,
  authorize("PROVIDER"),
  serviceController.getMyservices,
);

serviceRouter.get(
  "/service-details/:id",
  validateRequest(serviceValidation.serviceIdParamSchema),
  serviceController.getServiceDetails
);

serviceRouter.patch(
  "/update-service/:id",
  authMiddleware,
  authorize("PROVIDER"),
  validateRequest(serviceValidation.updateServiceSchema),
  serviceController.updateService,
);

serviceRouter.delete(
  "/delete-service/:id",
  authMiddleware,
  authorize("PROVIDER"),
  validateRequest(serviceValidation.serviceIdParamSchema),
  serviceController.deleteService,
);

serviceRouter.get("/all-services", serviceController.getAllServices);

export default serviceRouter;
