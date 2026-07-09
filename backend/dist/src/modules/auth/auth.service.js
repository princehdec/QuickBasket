import { ApiError } from "../../shared/utils/apiError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken, } from "../../shared/utils/jwt.js";
import { hashPassword, comparePassword } from "../../shared/utils/password.js";
import { AuthRepository } from "./auth.repository.js";
const repo = new AuthRepository();
function toAuthUserDTO(user) {
    return {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
    };
}
function generateTokens(userId, role) {
    const payload = { sub: userId, role };
    return {
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
    };
}
export class AuthService {
    async register(dto) {
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
    async login(dto) {
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
    async refresh(dto) {
        let payload;
        try {
            payload = verifyRefreshToken(dto.refreshToken);
        }
        catch {
            throw ApiError.unauthorized("Invalid or expired refresh token");
        }
        const user = await repo.findById(payload.sub);
        if (!user) {
            throw ApiError.unauthorized("User not found");
        }
        return generateTokens(user.id, user.role);
    }
    async getProfile(userId) {
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
//# sourceMappingURL=auth.service.js.map