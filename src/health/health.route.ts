import { Router } from "express";
import { healthController } from "./health.controller.js";

const healthRouter = Router();
healthRouter.get("/live", healthController.live);
healthRouter.get("/ready", healthController.ready);

export default healthRouter;
