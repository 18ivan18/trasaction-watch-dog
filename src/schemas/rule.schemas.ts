import { z } from "zod";

// Rule creation schema - at least one property must be provided
export const createRuleSchema = z
  .object({
    fromAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
      .optional(),
    toAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
      .optional(),
    value: z.string().optional(),
    nonce: z.number().int().positive().optional(),
    gasPrice: z.string().optional(),
    gasLimit: z.string().optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).some(
        (key) => data[key as keyof typeof data] !== undefined,
      );
    },
    {
      message: "At least one property must be provided",
      path: ["fromAddress"], // This will show the error on the first field
    },
  );

// Rule update schema
export const updateRuleSchema = z.object({
  fromAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .optional(),
  toAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .optional(),
  value: z.string().optional(),
  nonce: z.number().int().positive().optional(),
  gasPrice: z.string().optional(),
  gasLimit: z.string().optional(),
});

// Rule ID parameter schema
export const ruleIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

// Type exports for TypeScript
export type CreateRuleRequest = z.infer<typeof createRuleSchema>;
export type UpdateRuleRequest = z.infer<typeof updateRuleSchema>;
export type RuleIdRequest = z.infer<typeof ruleIdSchema>;
