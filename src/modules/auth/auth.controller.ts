import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";
import type { SignupDto, SigninDto, RefreshTokenDto } from "./auth.validation.js";

const signup = catchAsync(async (req: Request, res: Response) => {
    // validateRequest middleware-এর পর req.body হলো Zod-parsed SignupDto
    const dto = req.body as SignupDto;
    const result = await authService.signup(dto);
    sendResponse(res, {
        statusCode : 201,
        message : "Account created successfuly!",
        data: result
    })
})

const signin = catchAsync(async (req: Request, res: Response) => {
    const dto = req.body as SigninDto;
    const result = await authService.signin(dto);
    sendResponse(res, {
        statusCode : 200,
        message : "Signin successfuly!",
        data: result
    })
})

const refreshAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body as RefreshTokenDto;

    const result = await authService.refreshAccessToken(refreshToken);

    sendResponse(res, {
      statusCode: 200,
      message: "Access token refreshed successfully",
      data: result,
    });
  },
);

const logout = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body as RefreshTokenDto;

    await authService.logout(refreshToken);

    sendResponse(res, {
      statusCode: 200,
      message: "Logout successful",
      data: null,
    });
  },
);


export const authController = {
    signup,
    signin,
    refreshAccessToken,
    logout
}