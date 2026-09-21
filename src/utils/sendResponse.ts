import type { Response } from "express";

export type ResponseOptions<T> = {
  statusCode: number;
  message: string;
  data?: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

const sendResponse = <T>(res: Response, options: ResponseOptions<T>): void => {
  const { statusCode, ...body } = options;
  res.status(statusCode).json({ success: statusCode < 400, ...body });
};

export default sendResponse;
