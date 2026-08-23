export type OtpSendDTO = {
  phone: string;
};

export type OtpVerifyDTO = {
  phone: string;
  otp: string;
  challengeId?: string;
};

export type CompleteProfileDTO = {
  fullName?: string;
  email?: string;
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
  isNewUser: boolean;
};

export type OtpSendResponseDTO = {
  challengeId: string;
  expiresAt: string;
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
