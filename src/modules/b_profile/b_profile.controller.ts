import { Request, Response } from "express";
import { businessProfileService } from "./b_profile.service.js";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../utils/catchAsync.js";


const createBusinessProfile = catchAsync(async (
  req: Request,
  res: Response
) => {
  const result = await businessProfileService.createBusinessProfile({
    accountId: req.user.id,
    data: req.body,
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
  const result =
    await businessProfileService.updateMyBusinessProfile({
      accountId: req.user.id,
      data: req.body,
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