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
export const loginSchema = z.object({
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});
//# sourceMappingURL=auth.validation.js.map