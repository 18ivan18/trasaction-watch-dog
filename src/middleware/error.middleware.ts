import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from "../types/errors.js";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Handle custom errors
  if (error instanceof NotFoundError) {
    return res.status(error.statusCode).json({
      error: "Not Found",
      message: error.message,
      resource: error.resource,
    });
  }

  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      error: "Validation Error",
      message: error.message,
      field: error.field,
    });
  }

  if (error instanceof ConflictError) {
    return res.status(error.statusCode).json({
      error: "Conflict",
      message: error.message,
    });
  }

  // Default to 500 Internal Server Error
  return res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
};
