import { ApiError } from "../utils/apiError.js";
export function validate(schema, source = "body") {
    return (req, _res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            throw ApiError.badRequest("Validation failed", result.error.errors);
        }
        req[source] = result.data;
        next();
    };
}
//# sourceMappingURL=validate.js.map