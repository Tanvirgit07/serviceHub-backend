import { Router } from "express";
import healthRouter from "../health/health.route.js";

const router = Router();

router.use("/health", healthRouter);

// Register feature routers here as modules are added.

export default router;
