import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";
import { sendError } from "../utils/apiResponse";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    sendError(res, "Validation failed", 400, formatted);
    return;
  }

  if (env.NODE_ENV === "development") {
    console.error("Unhandled error:", err);
  }

  sendError(res, "Internal server error", 500);
}
