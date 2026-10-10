import { Request, Response } from "express";
import { serviceService } from "./service.service.js";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../utils/catchAsync.js";
import type { CreateServiceDto, UpdateServiceDto, GetAllServicesQueryDto } from "./service.validation.js";

const createService = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user.id;
  // explicit destructure — শুধু প্রয়োজনীয় fields service-এ যাচ্ছে
  const { title, description, price, availability } = req.body as CreateServiceDto;

  const result = await serviceService.createService({
    providerId,
    data: { title, description, price, availability },
  });

  sendResponse(res, {
    statusCode: 201, // ✅ POST (create) = 201
    message: "Service created successfuly!",
    data: result,
  });
});

const getMyservices = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user.id;

  const result = await serviceService.getMyservices(providerId);

  sendResponse(res, {
    statusCode: 200, // ✅ GET (read) = 200
    message: "Your services retrieved successfully",
    data: result,
  });
});

const getServiceDetails = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id as string;
  const result = await serviceService.getServiceDetails(serviceId);
  sendResponse(res, {
    statusCode: 200, // ✅ GET (read) = 200
    message: "Service details retrieved successfully",
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user.id as string;
  const serviceId  = req.params.id as string;
  const data       = req.body as UpdateServiceDto;

  const result = await serviceService.updateService({
    serviceId,
    providerId,
    data,
  });

  sendResponse(res, {
    statusCode: 200, // ✅ PATCH (update) = 200
    message: "Service updated successfully",
    data: result,
  });
});

const deleteService = catchAsync(async(req: Request, res: Response) => {
    const providerId = req.user.id as string;
    const serviceId  = req.params.id as string;

    const result = await serviceService.deleteService({ serviceId, providerId });

    sendResponse(res, {
        statusCode: 200, // ✅ DELETE = 200
        message: "Service deleted successfully",
        data: result
    })
})

// catchAsync যোগ করা হয়েছে — আগে ছিল না, error catch হতো না
const getAllServices = catchAsync(async (req: Request, res: Response) => {
    // validateRequest middleware query validate ও coerce করেছে
    const query = req.query as unknown as GetAllServicesQueryDto;
    const result = await serviceService.getAllServices(query);

    sendResponse(res, {
        statusCode: 200, // ✅ GET (read) = 200
        message: "Services retrieved successfully",
        data: result
    })
})

export const serviceController = {
  createService,
  getMyservices,
  getServiceDetails,
  updateService,
  deleteService,
  getAllServices
};
