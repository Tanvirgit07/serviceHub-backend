import { Router } from "express";
import healthRouter from "../health/health.route.js";
import authRouter from "../modules/auth/auth.route.js";
import serviceRouter from "../modules/service/service.route.js";
import OrderRouter from "../modules/orders/order.route.js";
import b_profileRouter from "../modules/b_profile/b_profile.route.js";
import customerRouter from "../modules/customer/customer.route.js";
import providerRouter from "../modules/provider/provider.route.js";

const router = Router();

router.use("/health", healthRouter);

// Fetures routes 
router.use("/auth", authRouter)
router.use("/service", serviceRouter)
router.use("/order", OrderRouter)
router.use("/b_profile", b_profileRouter)
router.use("/customer", customerRouter)
router.use("/provider", providerRouter)

export default router;
