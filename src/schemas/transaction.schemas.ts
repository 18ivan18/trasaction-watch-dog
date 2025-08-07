import { z } from "zod";

// Pagination query parameters schema
export const paginationQuerySchema = z.object({
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .optional(),
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .transform(Number)
    .optional(),
});

// Single transaction schema
export const transactionSchema = z.object({
  from: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .optional(),
  gasLimit: z.string(),
  gasPrice: z.string().optional(),
  hash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash")
    .optional(),
  nonce: z.number().int().nonnegative(),
  ruleIds: z.array(z.number().int().positive()),
  to: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .nullish(),
  type: z.number().int().optional(),
  value: z.string(),
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

export type BatchInsertTransactionsRequest = z.infer<
  typeof batchInsertTransactionsSchema
>;
export type PaginationQueryRequest = z.infer<typeof paginationQuerySchema>;
export type TransactionIdRequest = z.infer<typeof transactionIdSchema>;
// Type exports for TypeScript
export type TransactionRequest = z.infer<typeof transactionSchema>;
