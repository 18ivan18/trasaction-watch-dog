import { z } from "zod";

// Pagination query parameters schema
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .transform(Number)
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .optional(),
});

// Single transaction schema
export const transactionSchema = z.object({
  hash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash")
    .optional(),
  to: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .nullish(),
  from: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .optional(),
  nonce: z.number().int().nonnegative(),
  gasLimit: z.string(),
  gasPrice: z.string().optional(),
  value: z.string(),
  type: z.number().int().optional(),
  ruleIds: z.array(z.number().int().positive()),
});

// Batch insert schema
export const batchInsertTransactionsSchema = z.object({
  transactions: z
    .array(transactionSchema)
    .min(1, "At least one transaction is required"),
});

// Transaction ID parameter schema
export const transactionIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

// Type exports for TypeScript
export type TransactionRequest = z.infer<typeof transactionSchema>;
export type BatchInsertTransactionsRequest = z.infer<
  typeof batchInsertTransactionsSchema
>;
export type TransactionIdRequest = z.infer<typeof transactionIdSchema>;
export type PaginationQueryRequest = z.infer<typeof paginationQuerySchema>;
