import { Request, Response } from "express";

import { customerService } from "./customer.service.js";
import catchAsync from "../../utils/catchAsync.js";

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer(req.body);

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data: customer,
  });
});

const getCustomers = catchAsync(async (_req: Request, res: Response) => {
  const customers = await customerService.getCustomers();

  res.status(200).json({
    success: true,
    message: "Customers retrieved successfully",
    data: customers,
  });
});

const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const customer = await customerService.getCustomerById(id);

  res.status(200).json({
    success: true,
    message: "Customer retrieved successfully",
    data: customer,
  });
});

const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const customer = await customerService.updateCustomer(id, req.body);

  res.status(200).json({
    success: true,
    message: "Customer updated successfully",
    data: customer,
  });
});

const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await customerService.deleteCustomer(id);

  res.status(200).json({
    success: true,
    message: "Customer deleted successfully",
  });
});

export const customerController = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
