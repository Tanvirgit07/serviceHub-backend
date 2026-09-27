import { NextFunction, Request, Response } from "express";

import AppError from "../errors/AppError.js";
import { Role } from "../generated/prisma/enums.js";

const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("You are not authorized", 403);
    }

    next();
  };
};

export default authorize;