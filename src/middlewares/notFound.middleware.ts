import type { RequestHandler } from "express";
import AppError from "../errors/AppError.js";

const notFoundMiddleware: RequestHandler = (_req, _res, next) => {
  next(new AppError("Endpoint not found", 404));
};

export default notFoundMiddleware;