import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { sendError } from "../utils/apiResponse.js";
import { ZodError } from "zod";
export function errorHandler(err, _req, res, _next) {
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
//# sourceMappingURL=errorHandler.js.map