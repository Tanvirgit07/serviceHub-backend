import { Router } from "express";
import { customerController } from "./customer.controller.js";
import { customerValidation } from "./customer.validation.js";
import validateRequest from "../../middlewares/validateRequest.js";

const customerRouter = Router();

customerRouter.post(
  "/create-customer",
  validateRequest(customerValidation.createCustomer),
  customerController.createCustomer,
);

customerRouter.get(
  "/get-customers",
  customerController.getCustomers,
);

customerRouter.get(
  "/get-customer/:id",
  validateRequest(customerValidation.validateCustomerId),
  customerController.getCustomerById,
);

customerRouter.put(
  "/update-customer/:id",
  validateRequest(customerValidation.validateCustomerId),
  validateRequest(customerValidation.updateCustomer),
  customerController.updateCustomer,
);

customerRouter.delete(
  "/delete-customer/:id",
  validateRequest(customerValidation.validateCustomerId),
  customerController.deleteCustomer,
);

export default customerRouter;