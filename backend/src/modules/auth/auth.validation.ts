import { z } from "zod";

const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{9,14}$/, "Phone must be in international format (e.g. +919876543210)");

export const sendOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
  challengeId: z.string().uuid().optional(),
});

export const completeProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
