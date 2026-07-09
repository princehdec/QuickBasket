export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly errors?: unknown;
    constructor(statusCode: number, message: string, errors?: unknown);
    static badRequest(message?: string, errors?: unknown): ApiError;
    static unauthorized(message?: string): ApiError;
    static forbidden(message?: string): ApiError;
    static notFound(message?: string): ApiError;
    static conflict(message?: string): ApiError;
    static internal(message?: string): ApiError;
}
//# sourceMappingURL=apiError.d.ts.map