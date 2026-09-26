import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";

const signup = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.signup(req.body);
    sendResponse(res, {
        statusCode : 201,
        message : "Account created successfuly!",
        data: result
    })
})

const signin = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.signin(req.body);
    sendResponse(res, {
        statusCode : 200,
        message : "Signin successfuly!",
        data: result
    })
})

const refreshAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

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
    const { refreshToken } = req.body;

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