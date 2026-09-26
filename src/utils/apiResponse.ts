import { Response } from 'express';

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message = 'Request successful',
  data = undefined,
  meta = undefined,
}: ApiResponseOptions<T>): Response => {
  const payload: Record<string, unknown> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  if (meta !== undefined) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode = 500,
  message = 'Something went wrong',
  errors: unknown[] = []
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
};
