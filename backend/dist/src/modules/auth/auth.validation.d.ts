import { z } from "zod";
export declare const sendOtpSchema: z.ZodObject<{
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
}, {
    phone: string;
}>;
export declare const verifyOtpSchema: z.ZodObject<{
    phone: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
    otp: string;
}, {
    phone: string;
    otp: string;
}>;
export declare const signupSchema: z.ZodObject<{
    phone: z.ZodString;
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    name: string;
    email?: string | undefined;
}, {
    phone: string;
    name: string;
    email?: string | undefined;
}>;
export declare const otpLoginSchema: z.ZodObject<{
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
}, {
    phone: string;
}>;
export declare const registerSchema: z.ZodObject<{
    phone: z.ZodString;
    fullName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
    password: string;
    email?: string | undefined;
    fullName?: string | undefined;
}, {
    phone: string;
    password: string;
    email?: string | undefined;
    fullName?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    phone: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
    password: string;
}, {
    phone: string;
    password: string;
}>;
export declare const refreshSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
//# sourceMappingURL=auth.validation.d.ts.map