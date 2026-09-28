import { Request, Response } from "express";
import { providerService } from "./provider.service.js";
import sendResponse from "../../utils/sendResponse.js";


const getAllProviders = async (
  req: Request,
  res: Response
) => {
  const result = await providerService.getAllProviders();

  sendResponse(res, {
    statusCode: 200,
    message: "Providers retrieved successfully",
    data: result,
  });
};

const getProviderById = async (
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
};

export const providerController = {
  getAllProviders,
  getProviderById,
};