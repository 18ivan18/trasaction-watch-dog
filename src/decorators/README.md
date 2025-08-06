# Validation Decorator with Type Casting

This decorator provides automatic request validation and type casting for controller methods using Zod schemas.

## Features

- **Automatic Validation**: Validates request body, params, and query against the provided Zod schema
- **Type Casting**: Automatically casts validated data to the appropriate types
- **Type Safety**: Provides full TypeScript support with proper type inference
- **Error Handling**: Returns detailed validation errors if validation fails

## Usage

### Basic Usage

```typescript
import { ValidateBody, ValidateParams } from "../decorators/validation.decorator.js";
import { ValidatedBodyRequest, ValidatedParamsRequest, ValidatedType } from "../types/validated-request.js";

@POST()
@ValidateBody(createTaskSchema)
async createTask(req: ValidatedBodyRequest<ValidatedType<typeof createTaskSchema>>, res: Response) {
  const { name, done = false } = req.body; // Now properly typed!
  // name is typed as string, done is typed as boolean
}
```

### Multiple Validations

```typescript
@PUT()
@ValidateBody(updateTaskSchema)
@ValidateParams(taskIdSchema)
async updateTask(
  req: ValidatedRequestWith<
    ValidatedType<typeof updateTaskSchema>,
    ValidatedType<typeof taskIdSchema>
  >,
  res: Response
) {
  const id = req.params.id; // Now typed as number!
  const { name, done } = req.body; // Properly typed
}
```

## Available Decorators

- `@ValidateBody(schema)` - Validates and casts request body
- `@ValidateParams(schema)` - Validates and casts URL parameters
- `@ValidateQuery(schema)` - Validates and casts query parameters
- `@ValidateRequest(schema, type)` - Generic validation for any request part

## Type Utilities

- `ValidatedBodyRequest<T>` - Request with validated body
- `ValidatedParamsRequest<T>` - Request with validated params
- `ValidatedQueryRequest<T>` - Request with validated query
- `ValidatedRequestWith<TBody, TParams, TQuery>` - Request with multiple validations
- `ValidatedType<T>` - Extract type from Zod schema

## Schema Examples

```typescript
// Schema with type transformation
const taskIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

// Body schema
const createTaskSchema = z.object({
  name: z.string().min(1, "Name is required"),
  done: z.boolean().optional().default(false),
});

// Usage
@ValidateParams(taskIdSchema)
async getTask(req: ValidatedParamsRequest<ValidatedType<typeof taskIdSchema>>) {
  const id = req.params.id; // Type: number (not string!)
}
```

## Error Response Format

When validation fails, the decorator returns:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "body.name",
      "message": "Name is required"
    }
  ]
}
```

## Benefits

1. **Type Safety**: No more `parseInt()` calls - types are automatically cast
2. **Runtime Validation**: Ensures data integrity at runtime
3. **Compile-time Safety**: TypeScript knows the exact types after validation
4. **Clean Code**: Removes boilerplate validation code from controllers
