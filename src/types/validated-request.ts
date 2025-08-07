import { Request } from "express";
import { z } from "zod";

// Type for body-only validation
export type ValidatedBodyRequest<T> = Omit<Request, "body"> & {
  body: T;
};

// Type for params-only validation
export type ValidatedParamsRequest<T> = Omit<Request, "params"> & {
  params: T;
};

// Type for query-only validation
export type ValidatedQueryRequest<T> = Omit<Request, "query"> & {
  query: T;
};

// Type for combining multiple validations
export type ValidatedRequestWith<
  TBody = never,
  TParams = never,
  TQuery = never,
> = Omit<Request, "body" | "params" | "query"> & {
  body: TBody extends never ? Request["body"] : TBody;
  params: TParams extends never ? Request["params"] : TParams;
  query: TQuery extends never ? Request["query"] : TQuery;
};

// Helper type to extract the validated type from a Zod schema
export type ValidatedType<T extends z.ZodSchema> = z.infer<T>;
