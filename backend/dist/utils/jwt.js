import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
const accessSecret = env.JWT_ACCESS_SECRET;
const refreshSecret = env.JWT_REFRESH_SECRET;
export function signAccessToken(payload) {
    return jwt.sign(payload, accessSecret, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
}
export function signRefreshToken(payload) {
    return jwt.sign(payload, refreshSecret, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, accessSecret);
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, refreshSecret);
}
//# sourceMappingURL=jwt.js.map