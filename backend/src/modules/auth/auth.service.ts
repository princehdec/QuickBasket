import { ApiError } from "../../shared/utils/apiError";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type JwtPayload,
} from "../../shared/utils/jwt";
import { hashPassword, comparePassword } from "../../shared/utils/password";
import { AuthRepository } from "./auth.repository";
import type {
  RegisterDTO,
  LoginDTO,
  RefreshDTO,
  AuthResponseDTO,
  AuthTokensDTO,
  AuthUserDTO,
  UserProfileDTO,
} from "./auth.dto";

const repo = new AuthRepository();

function toAuthUserDTO(user: {
  id: string;
  fullName: string | null;
  phone: string;
  email: string | null;
  role: string;
}): AuthUserDTO {
  return {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    role: user.role,
  };
}

function generateTokens(userId: string, role: string): {
  accessToken: string;
  refreshToken: string;
} {
  const payload: JwtPayload = { sub: userId, role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export class AuthService {
  async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const existing = await repo.findByPhone(dto.phone);
    if (existing) {
      throw ApiError.conflict("Phone number already registered");
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await repo.create({
      phone: dto.phone,
      fullName: dto.fullName ?? null,
      email: dto.email ?? null,
      passwordHash,
      role: "customer",
    });

    const tokens = generateTokens(user.id, user.role);

    return {
      user: toAuthUserDTO(user),
      tokens,
    };
  }

  async login(dto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await repo.findByPhone(dto.phone);
    if (!user) {
      throw ApiError.unauthorized("Invalid phone or password");
    }

    if (!user.passwordHash) {
      throw ApiError.unauthorized("This account uses OTP login. Please use the OTP flow.");
    }

    const valid = await comparePassword(dto.password, user.passwordHash);
    if (!valid) {
      throw ApiError.unauthorized("Invalid phone or password");
    }

    const tokens = generateTokens(user.id, user.role);

    return {
      user: toAuthUserDTO(user),
      tokens,
    };
  }

  async refresh(dto: RefreshDTO): Promise<AuthTokensDTO> {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(dto.refreshToken);
    } catch {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    const user = await repo.findById(payload.sub);
    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    return generateTokens(user.id, user.role);
  }

  async getProfile(userId: string): Promise<UserProfileDTO> {
    const user = await repo.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }
}
