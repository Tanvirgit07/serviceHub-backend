import { Router } from "express";
import { customerController } from "./customer.controller.js";

const customerRouter = Router();

customerRouter.post("/create-customer", customerController.createCustomer);

export default customerRouter;
