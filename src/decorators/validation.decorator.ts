import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// Decorator factory that accepts a validation schema
export function ValidateRequest(
  schema: z.ZodSchema,
  type: "body" | "params" | "query",
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // Store the original method
    const originalMethod = descriptor.value;

    // Replace the method with validation wrapper
    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      console.log(req[type]);
      // Validate the request using the schema
      schema.parse(req[type]);

      // If validation passes, call the original method
      return await originalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
}
