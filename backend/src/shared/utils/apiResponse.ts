import type { Response } from "express";
import type { ApiResponse } from "../types/api";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: ApiResponse["meta"]
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown
): void {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  };
  res.status(statusCode).json(response);
}
