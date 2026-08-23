import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { AuthService } from "./auth.service";
import type { OtpSendDTO, OtpVerifyDTO, RefreshDTO } from "./auth.dto";

const service = new AuthService();

export const sendOtp = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await service.sendOtp(req.body as OtpSendDTO);
    sendSuccess(res, result, "OTP sent");
  },
);

export const verifyOtp = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await service.verifyOtp(req.body as OtpVerifyDTO);
    sendSuccess(res, result, "OTP verified");
  },
);

export const refresh = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const dto = req.body as RefreshDTO;
    const result = await service.refresh(dto.refreshToken);
    sendSuccess(res, result, "Token refreshed");
  },
);

export const logout = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    sendSuccess(res, null, "Logged out successfully");
  },
);

export const me = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const profile = await service.getProfile(req.user!.sub);
    sendSuccess(res, profile, "Profile retrieved");
  },
);
