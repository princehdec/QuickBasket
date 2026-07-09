import type { Response } from "express";
import type { ApiResponse } from "../types/api.js";
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: ApiResponse["meta"]): void;
export declare function sendError(res: Response, message: string, statusCode?: number, errors?: unknown): void;
//# sourceMappingURL=apiResponse.d.ts.map