import healthRouter from "../modules/health/health.route.js";
import { Router } from "express";
import customerRouter from "../modules/customer/customer.route.js";

const router = Router();

router.use("/customer", customerRouter);
router.use("/health", healthRouter);

export default router;