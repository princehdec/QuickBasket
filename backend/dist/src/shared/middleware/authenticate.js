import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "../utils/apiError.js";
export function authenticate(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        throw ApiError.unauthorized("Missing or invalid authorization header");
    }
    const token = header.split(" ")[1];
    if (!token) {
        throw ApiError.unauthorized("Missing access token");
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    }
    catch {
        throw ApiError.unauthorized("Invalid or expired access token");
    }
}
//# sourceMappingURL=authenticate.js.map