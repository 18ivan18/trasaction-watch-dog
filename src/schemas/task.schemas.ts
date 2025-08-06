import { z } from "zod";

// Task creation schema
export const createTaskSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  done: z.boolean().optional().default(false),
});

// Task update schema
export const updateTaskSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long")
    .optional(),
  done: z.boolean().optional(),
});

// Task ID parameter schema
export const taskIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

// Query parameters schema (for future use)
export const taskQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  offset: z.string().regex(/^\d+$/, "Offset must be a number").optional(),
  done: z.enum(["true", "false"]).optional(),
});

// Type exports for TypeScript
export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;
export type TaskIdRequest = z.infer<typeof taskIdSchema>;
export type TaskQueryRequest = z.infer<typeof taskQuerySchema>;
