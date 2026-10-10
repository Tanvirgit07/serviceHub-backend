import { Request, Response } from "express";
import { providerService } from "./provider.service.js";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../utils/catchAsync.js";


// catchAsync যোগ করা হয়েছে — আগে ছিল না, error catch হতো না
const getAllProviders = catchAsync(async (
  req: Request,
  res: Response
) => {
  const result = await providerService.getAllProviders();

  sendResponse(res, {
    statusCode: 200,
    message: "Providers retrieved successfully",
    data: result,
  });
});

// catchAsync যোগ করা হয়েছে — আগে ছিল না, error catch হতো না
const getProviderById = catchAsync(async (
  req: Request,
  res: Response
) => {
  const result = await providerService.getProviderById({
    providerId: req.params.id as string,
  });

  sendResponse(res, {
    statusCode: 200,
    message: "Provider retrieved successfully",
    data: result,
  });
});

export const providerController = {
  getAllProviders,
  getProviderById,
};