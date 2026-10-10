import { Request, Response } from "express";
import { businessProfileService } from "./b_profile.service.js";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../utils/catchAsync.js";
import type { CreateBusinessProfileDto, UpdateBusinessProfileDto } from "./b_profile.validation.js";


const createBusinessProfile = catchAsync(async (
  req: Request,
  res: Response
) => {
  // explicit destructure — শুধু প্রয়োজনীয় fields service-এ যাচ্ছে
  const { businessName, description, phone, address } = req.body as CreateBusinessProfileDto;

  const result = await businessProfileService.createBusinessProfile({
    accountId: req.user.id,
    data: { businessName, description, phone, address },
  });

  sendResponse(res, {
    statusCode: 201,
    message: "Business profile created successfully",
    data: result,
  });
});

const getMyBusinessProfile = catchAsync(async (
  req: Request,
  res: Response
) => {
  const result =
    await businessProfileService.getMyBusinessProfile(
      req.user.id
    );

  sendResponse(res, {
    statusCode: 200,
    message: "Business profile retrieved successfully",
    data: result,
  });
});

const updateMyBusinessProfile = catchAsync(async (
  req: Request,
  res: Response
) => {
  const { businessName, description, phone, address } = req.body as UpdateBusinessProfileDto;

  const result =
    await businessProfileService.updateMyBusinessProfile({
      accountId: req.user.id,
      data: { businessName, description, phone, address },
    });

  sendResponse(res, {
    statusCode: 200,
    message: "Business profile updated successfully",
    data: result,
  });
});

export const businessProfileController = {
  createBusinessProfile,
  getMyBusinessProfile,
  updateMyBusinessProfile,
};