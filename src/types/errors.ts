export class NotFoundError extends Error {
  public statusCode: number;
  public resource: string;

  constructor(resource: string, id?: string | number) {
    const message = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.resource = resource;
  }
}

export class ValidationError extends Error {
  public statusCode: number;
  public field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.field = field;
  }
}

export class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}
