import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodType } from "zod";

const validateRequest = (schema: ZodType): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as { body?: any; query?: any; params?: any };

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;