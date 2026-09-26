export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: unknown[];
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, errors: unknown[] = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', errors: unknown[] = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized', errors: unknown[] = []) {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = 'Forbidden', errors: unknown[] = []) {
    return new ApiError(403, message, errors);
  }

  static notFound(message = 'Resource not found', errors: unknown[] = []) {
    return new ApiError(404, message, errors);
  }

  static conflict(message = 'Resource conflict', errors: unknown[] = []) {
    return new ApiError(409, message, errors);
  }

  static unprocessable(message = 'Unprocessable Entity', errors: unknown[] = []) {
    return new ApiError(422, message, errors);
  }

  static internal(message = 'Internal Server Error', errors: unknown[] = []) {
    return new ApiError(500, message, errors, false);
  }
}
