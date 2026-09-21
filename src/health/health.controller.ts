import type { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { healthService } from "./health.service.js";

const live = (_req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  sendResponse(res, {
    statusCode: 200,
    message: "Server is running",
    data: { status: "up" },
  });
};

const ready = catchAsync(async (_req: Request, res: Response) => {
  const connected = await healthService.checkDatabase();
  res.setHeader("Cache-Control", "no-store");
  sendResponse(res, {
    statusCode: connected ? 200 : 503,
    message: connected ? "Server is ready" : "Database is unavailable",
    data: { database: connected ? "up" : "down" },
  });
});

export const healthController = { live, ready };
