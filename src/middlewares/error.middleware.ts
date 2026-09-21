import type { ErrorRequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";
import AppError from "../errors/AppError.js";

const errorMiddleware: ErrorRequestHandler = (
  err,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (
    err instanceof SyntaxError &&
    "type" in err &&
    err.type === "entity.parse.failed"
  ) {
    statusCode = 400;
    message = "Request body contains invalid JSON";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "A record with this unique value already exists";
        break;

      case "P2025":
        statusCode = 404;
        message = "Requested record not found";
        break;

      case "P2003":
        statusCode = 409;
        message = "Related record is missing or still in use";
        break;
    }
  }

  if (statusCode >= 500) {
    console.error("Unhandled error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;