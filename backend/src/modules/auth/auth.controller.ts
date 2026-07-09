import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { AuthService } from "./auth.service";
import type {
  RegisterDTO,
  LoginDTO,
  RefreshDTO,
} from "./auth.dto";

const service = new AuthService();

export const register = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const dto = req.body as RegisterDTO;
    const result = await service.register(dto);
    sendSuccess(res, result, "Registration successful", 201);
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const dto = req.body as LoginDTO;
    const result = await service.login(dto);
    sendSuccess(res, result, "Login successful");
  }
);

export const refresh = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const dto = req.body as RefreshDTO;
    const result = await service.refresh(dto);
    sendSuccess(res, result, "Token refreshed");
  }
);

export const logout = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    sendSuccess(res, null, "Logged out successfully");
  }
);

export const me = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const profile = await service.getProfile(req.user!.sub);
    sendSuccess(res, profile, "Profile retrieved");
  }
);
