import { Router } from "express";
import { customerController } from "./customer.controller.js";

const customerRouter = Router();

customerRouter.post("/create-customer", customerController.createCustomer);
customerRouter.get("/get-customers", customerController.getCustomers);
customerRouter.get("/get-customer/:id", customerController.getCustomerById);
customerRouter.put("/update-customer/:id", customerController.updateCustomer);
customerRouter.delete("/delete-customer/:id", customerController.deleteCustomer);

export default customerRouter;
