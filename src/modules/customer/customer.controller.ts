import { getQueryFilters } from "../../utils/queryFilters.js";
import { customerFilterSchema } from "./customer.validation.js";
import sendResponse from "../../utils/sendResponse.js";
import { getPagination } from "../../utils/pagination.js";
import type { Request, Response } from "express";

import { getSorting } from "../../utils/sorting.js";
import { customerService, customerSortFields } from "./customer.service.js";
import catchAsync from "../../utils/catchAsync.js";

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Customer created successfully",
    data: customer,
  });
});

const getCustomers = catchAsync(async (req: Request, res: Response) => {
  const { customers, meta } = await customerService.getCustomers(
    getPagination(req.query),
    getSorting(req.query, customerSortFields, { sortBy: "id", sortOrder: "asc" }),
    getQueryFilters(req.query, customerFilterSchema, ["page", "limit", "sortBy", "sortOrder"]),
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Customers retrieved successfully",
    data: customers,
    meta,
  });
});

const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const customer = await customerService.getCustomerById(id);

  sendResponse(res, {
    statusCode: 200,
    message: "Customer retrieved successfully",
    data: customer,
  });
});

const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const customer = await customerService.updateCustomer(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Customer updated successfully",
    data: customer,
  });
});

const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await customerService.deleteCustomer(id);

  sendResponse(res, {
    statusCode: 200,
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
