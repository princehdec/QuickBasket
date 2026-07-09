export type RegisterDTO = {
  phone: string;
  fullName?: string;
  email?: string;
  password: string;
};

export type LoginDTO = {
  phone: string;
  password: string;
};

export type RefreshDTO = {
  refreshToken: string;
};

export type AuthUserDTO = {
  id: string;
  fullName: string | null;
  phone: string;
  email: string | null;
  role: string;
};

export type AuthTokensDTO = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponseDTO = {
  user: AuthUserDTO;
  tokens: AuthTokensDTO;
};

export type UserProfileDTO = {
  id: string;
  fullName: string | null;
  phone: string;
  email: string | null;
  avatar: string | null;
  role: string;
  isVerified: boolean;
  createdAt: Date;
};
