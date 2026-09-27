import { Request, Response } from "express";
import { serviceService } from "./service.service.js";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../utils/catchAsync.js";

const createService = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user.id;

  const payload = {
    providerId,
    data: req.body,
  };

  const result = await serviceService.createService(payload);

  sendResponse(res, {
    statusCode: 201,
    message: "Service created successfuly!",
    data: result,
  });
});

const getMyservices = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user.id;

  const result = await serviceService.getMyservices(providerId);

  sendResponse(res, {
    statusCode: 201,
    message: "Your services retrieved successfully",
    data: result,
  });
});

const getServiceDetails = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id as string;
  const result = await serviceService.getServiceDetails(serviceId);
  sendResponse(res, {
    statusCode: 201,
    message: "Service details retrieved successfully",
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user.id as string;
  const serviceId = req.params.id as string;

  const payload = {
    serviceId,
    providerId,
    data: req.body,
  };

  const result = await serviceService.updateService(payload);

  sendResponse(res, {
    statusCode: 201,
    message: "Service updated successfully",
    data: result,
  });
});

const deleteService = catchAsync(async(req: Request, res: Response) => {
    const providerId = req.user.id as string;
    const serviceId = req.params.id as string;

    const deletePayload = {
        serviceId,
        providerId,
    }

    const result = await serviceService.deleteService(deletePayload);

    sendResponse(res, {
        statusCode: 201,
        message: "Service deleted successfully",
        data: result
    })
})

const getAllServices = async (req: Request, res: Response) => {
    const result = await serviceService.getAllServices(req.query);

    sendResponse(res, {
        statusCode : 201,
        message : "Services retrieved successfully",
        data: result
    })
}

export const serviceController = {
  createService,
  getMyservices,
  getServiceDetails,
  updateService,
  deleteService,
  getAllServices
};
