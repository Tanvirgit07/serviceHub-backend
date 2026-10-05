import { Request, Response } from "express";
import { customerService } from "./customer.service.js";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../utils/catchAsync.js";

const getProviderCustomers = catchAsync(async (
  req: Request,
  res: Response
) => {
  const result = await customerService.getProviderCustomers(
    req.user.id
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Customers retrieved successfully",
    data: result,
  });
});

const getProviderCustomerById = catchAsync(async (
  req: Request,
  res: Response
) => {
  const result =
    await customerService.getProviderCustomerById(
      req.params.id as string,
      req.user.id
    );

  sendResponse(res, {
    statusCode: 200,
    message: "Customer retrieved successfully",
    data: result,
  });
});

export const customerController = {
  getProviderCustomers,
  getProviderCustomerById,
};