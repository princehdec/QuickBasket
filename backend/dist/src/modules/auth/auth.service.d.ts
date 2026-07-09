import type { RegisterDTO, LoginDTO, RefreshDTO, AuthResponseDTO, AuthTokensDTO, UserProfileDTO } from "./auth.dto.js";
export declare class AuthService {
    register(dto: RegisterDTO): Promise<AuthResponseDTO>;
    login(dto: LoginDTO): Promise<AuthResponseDTO>;
    refresh(dto: RefreshDTO): Promise<AuthTokensDTO>;
    getProfile(userId: string): Promise<UserProfileDTO>;
}
//# sourceMappingURL=auth.service.d.ts.map