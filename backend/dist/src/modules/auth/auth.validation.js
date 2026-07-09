import { z } from "zod";
export const sendOtpSchema = z.object({
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});
export const verifyOtpSchema = z.object({
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});
export const signupSchema = z.object({
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email").optional(),
});
export const otpLoginSchema = z.object({
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});
export const registerSchema = z.object({
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Phone must be in international format (e.g. +919876543210)"),
    fullName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100)
        .optional(),
    email: z.string().email("Invalid email format").optional(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(128),
});
export const loginSchema = z.object({
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Phone must be in international format (e.g. +919876543210)"),
    password: z.string().min(1, "Password is required"),
});
export const refreshSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});
//# sourceMappingURL=auth.validation.js.map