import { randomInt } from "node:crypto";
import { ApiError } from "../../shared/utils/apiError";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type JwtPayload,
} from "../../shared/utils/jwt";
import { hashPassword, comparePassword } from "../../shared/utils/password";
import { AuthRepository } from "./auth.repository";
import { ConsoleOtpDelivery, type OtpDelivery } from "./otp.delivery";
import type {
  AuthResponseDTO,
  AuthTokensDTO,
  AuthUserDTO,
  OtpSendDTO,
  OtpSendResponseDTO,
  OtpVerifyDTO,
  UserProfileDTO,
} from "./auth.dto";

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

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

function generateTokens(userId: string, role: string): AuthTokensDTO {
  const payload: JwtPayload = { sub: userId, role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export class AuthService {
  private readonly repo: AuthRepository;
  private readonly otpDelivery: OtpDelivery;

  constructor(repo = new AuthRepository(), otpDelivery = new ConsoleOtpDelivery()) {
    this.repo = repo;
    this.otpDelivery = otpDelivery;
  }

  async sendOtp(dto: OtpSendDTO): Promise<OtpSendResponseDTO> {
    const code = randomInt(100000, 1000000).toString();
    const challenge = await this.repo.createOtpChallenge({
      phone: dto.phone,
      codeHash: await hashPassword(code),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
      maxAttempts: OTP_MAX_ATTEMPTS,
    });
    console.info("[OTP] challenge persisted");

    await this.otpDelivery.send(dto.phone, code);
    console.info("[OTP] delivery completed");

    return {
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt.toISOString(),
      ...(process.env.NODE_ENV !== "production" && process.env.OTP_EXPOSE_TEST_CODE === "true"
        ? { testCode: code }
        : {}),
    };
  }

  async verifyOtp(dto: OtpVerifyDTO): Promise<AuthResponseDTO> {
    const challenge = await this.repo.findActiveOtpChallenge(dto.phone, dto.challengeId);
    if (!challenge) {
      throw ApiError.unauthorized("OTP is invalid or expired");
    }

    const valid = await comparePassword(dto.otp, challenge.codeHash);
    if (!valid) {
      const shouldBlock = challenge.attempts + 1 >= challenge.maxAttempts;
      await this.repo.incrementOtpAttempt(challenge.id, shouldBlock);
      throw ApiError.unauthorized("Incorrect OTP");
    }

    await this.repo.consumeOtpChallenge(challenge.id);

    let user = await this.repo.findByPhone(dto.phone);
    const isNewUser = !user;
    if (!user) {
      user = await this.repo.create({
        phone: dto.phone,
        role: "customer",
        isVerified: true,
        passwordHash: null,
      });
    } else if (!user.isVerified) {
      user = await this.repo.updateProfile(user.id, {
        fullName: user.fullName,
        email: user.email,
      });
    }

    return {
      user: toAuthUserDTO(user),
      tokens: generateTokens(user.id, user.role),
      isNewUser,
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokensDTO> {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    const user = await this.repo.findById(payload.sub);
    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    return generateTokens(user.id, user.role);
  }

  async getProfile(userId: string): Promise<UserProfileDTO> {
    const user = await this.repo.findById(userId);
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
