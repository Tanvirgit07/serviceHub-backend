import { Router } from "express";
import customerRouter from "../modules/customer/customer.route.js";

const router = Router();

router.use("/customer", customerRouter);

export default router;