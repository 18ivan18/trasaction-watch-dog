import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Convenience decorators for specific validation types
export function ValidateBody(schema: z.ZodType) {
  return ValidateRequest(schema, "body");
}

export function ValidateParams(schema: z.ZodType) {
  return ValidateRequest(schema, "params");
}

export function ValidateQuery(schema: z.ZodType) {
  return ValidateRequest(schema, "query");
}

// Decorator factory that accepts a validation schema
export function ValidateRequest(
  schema: z.ZodType,
  type: "body" | "params" | "query",
) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // Store the original method
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const originalMethod = descriptor.value;

    // Replace the method with validation wrapper
    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      // Validate and transform the request data
      const validatedData = schema.parse(req[type]);

      if (type === "query") {
        // TODO: the req.query is readonly, so we can't assign to it
        // req.query = validatedData;
      } else {
        req[type] = validatedData;
      }

      // If validation passes, call the original method
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return originalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
}
