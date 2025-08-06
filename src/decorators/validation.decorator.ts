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
      // Validate and transform the request data
      const validatedData = schema.parse(req[type]);

      // Cast the validated data back to the request
      req[type] = validatedData;

      // If validation passes, call the original method
      return await originalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
}

// Convenience decorators for specific validation types
export function ValidateBody(schema: z.ZodSchema) {
  return ValidateRequest(schema, "body");
}

export function ValidateParams(schema: z.ZodSchema) {
  return ValidateRequest(schema, "params");
}

export function ValidateQuery(schema: z.ZodSchema) {
  return ValidateRequest(schema, "query");
}
