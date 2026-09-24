import { Router } from "express";
import healthRouter from "../health/health.route.js";
import authRouter from "../modules/auth/auth.route.js";

const router = Router();

router.use("/health", healthRouter);

// auth routes 
router.use("/auth", authRouter)

// Register feature routers here as modules are added.

export default router;
