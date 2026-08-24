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

  const errorCode = "code" in err && typeof err.code === "string" ? err.code : undefined;
  console.error("Unhandled API error:", {
    name: err.name,
    code: errorCode,
    message: err.message.slice(0, 240),
  });

  if (env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  sendError(res, "Internal server error", 500);
}
