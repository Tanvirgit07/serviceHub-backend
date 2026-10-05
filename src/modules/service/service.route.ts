import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import { serviceController } from "./service.controller.js";
import { serviceService } from "./service.service.js";

const serviceRouter = Router();

serviceRouter.post(
  "/create-service",
  authMiddleware,
  authorize("PROVIDER"),
  serviceController.createService,
);

serviceRouter.get(
  "/my-services",
  authMiddleware,
  authorize("PROVIDER"),
  serviceController.getMyservices,
);

serviceRouter.get("/service-details/:id", serviceController.getServiceDetails);

serviceRouter.patch(
  "/update-service/:id",
  authMiddleware,
  authorize("PROVIDER"),
  serviceController.updateService,
);

serviceRouter.delete(
  "/delete-service/:id",
  authMiddleware,
  authorize("PROVIDER"),
  serviceController.deleteService,
);

serviceRouter.get("/all-services", serviceController.getAllServices);

export default serviceRouter;
