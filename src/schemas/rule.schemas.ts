import { z } from "zod";

// Rule creation schema - at least one property must be provided
export const createOrUpdateRuleSchema = z
  .object({
    fromAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
      .optional(),
    toAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
      .optional(),
    valueFrom: z.number().optional(),
    valueTo: z.number().optional(),
    nonce: z.number().int().positive().optional(),
    gasPrice: z.number().optional(),
    gasLimit: z.number().optional(),
    blockDelay: z.number().optional(),
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
  )
  .strict();

// Rule ID parameter schema
export const ruleIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

// Type exports for TypeScript
export type CreateOrUpdateRuleRequest = z.infer<
  typeof createOrUpdateRuleSchema
>;
export type RuleIdRequest = z.infer<typeof ruleIdSchema>;
