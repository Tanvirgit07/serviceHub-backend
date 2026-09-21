import type { Request, RequestHandler } from "express";
import AppError from "../errors/AppError.js";

type Validator = (req: Request) => string | undefined;

const validateRequest = (validator: Validator): RequestHandler => {
  return (req, _res, next) => {
    const message = validator(req);

    if (message) {
      return next(new AppError(message, 400));
    }

    next();
  };
};

export default validateRequest;