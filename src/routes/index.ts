import { Router } from "express";
import healthRouter from "../health/health.route.js";
import authRouter from "../modules/auth/auth.route.js";
import serviceRouter from "../modules/service/service.route.js";

const router = Router();

router.use("/health", healthRouter);

// Fetures routes 
router.use("/auth", authRouter)
router.use("/service", serviceRouter)

export default router;
