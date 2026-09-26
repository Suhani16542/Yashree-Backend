import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { ApiError } from '../utils/apiError.js';
import { sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error(`Error processing ${req.method} ${req.url}:`, err);

  // Handle custom ApiError
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 400, 'Validation failed', formattedErrors);
    return;
  }

  // Handle Multer File Upload Errors
  if (err instanceof multer.MulterError) {
    let message = `File upload error: ${err.message}`;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size is too large. Please check the allowed file size limit.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected file field: ${err.field}`;
    }
    sendError(res, 400, message, [{ code: err.code, field: err.field }]);
    return;
  }

  // Handle Mongoose CastError (e.g. Invalid ObjectId)
  if (err?.name === 'CastError') {
    sendError(res, 400, `Invalid ${err.path}: ${err.value}`);
    return;
  }

  // Handle Mongoose Duplicate Key Error (code 11000)
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    sendError(res, 409, `Duplicate value entered for ${field}. It must be unique.`);
    return;
  }

  // Handle Mongoose ValidationError
  if (err?.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((el: any) => ({
      field: el.path,
      message: el.message,
    }));
    sendError(res, 400, 'Database validation failed', errors);
    return;
  }

  // Generic internal server error
  const message =
    env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err?.message || 'Internal Server Error';

  const errors = env.NODE_ENV === 'production' ? [] : [err?.stack];

  sendError(res, 500, message, errors);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
};
