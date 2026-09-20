import { ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  console.log("FULL ERROR:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

export default errorMiddleware;