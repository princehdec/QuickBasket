export function sendSuccess(res, data, message = "Success", statusCode = 200, meta) {
    const response = {
        success: true,
        message,
        data,
        ...(meta && { meta }),
    };
    res.status(statusCode).json(response);
}
export function sendError(res, message, statusCode = 500, errors) {
    const response = {
        success: false,
        message,
        ...(errors ? { errors } : {}),
    };
    res.status(statusCode).json(response);
}
//# sourceMappingURL=apiResponse.js.map