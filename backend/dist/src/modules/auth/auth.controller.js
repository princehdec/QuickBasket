import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../shared/utils/apiResponse.js";
import { AuthService } from "./auth.service.js";
const service = new AuthService();
export const register = asyncHandler(async (req, res, _next) => {
    const dto = req.body;
    const result = await service.register(dto);
    sendSuccess(res, result, "Registration successful", 201);
});
export const login = asyncHandler(async (req, res, _next) => {
    const dto = req.body;
    const result = await service.login(dto);
    sendSuccess(res, result, "Login successful");
});
export const refresh = asyncHandler(async (req, res, _next) => {
    const dto = req.body;
    const result = await service.refresh(dto);
    sendSuccess(res, result, "Token refreshed");
});
export const logout = asyncHandler(async (_req, res, _next) => {
    sendSuccess(res, null, "Logged out successfully");
});
export const me = asyncHandler(async (req, res, _next) => {
    const profile = await service.getProfile(req.user.sub);
    sendSuccess(res, profile, "Profile retrieved");
});
//# sourceMappingURL=auth.controller.js.map