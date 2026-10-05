import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js";
import { env } from "../config/env.js";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Get authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Authentication required", 401);
  }

  // 2. Extract token
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Invalid authorization format", 401);
  }

  try {
    // 3. Verify access token
    const decoded = jwt.verify(
      token,
      env.jwt.accessSecret,
    ) as {
      id: string;
      email: string;
      role: "CUSTOMER" | "PROVIDER";
    };

    // 4. Attach authenticated user to request
    req.user = decoded;

    // 5. Continue to next middleware/controller
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expired", 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token", 401);
    }
    throw new AppError("Authentication failed", 401);
  }
};

export default authMiddleware;