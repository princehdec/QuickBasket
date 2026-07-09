import { z } from "zod";
export declare const storeQuerySchema: z.ZodObject<{
    city: z.ZodOptional<z.ZodString>;
    lat: z.ZodOptional<z.ZodString>;
    lng: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    isOpen: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    search?: string | undefined;
    city?: string | undefined;
    lat?: string | undefined;
    lng?: string | undefined;
    isOpen?: boolean | undefined;
}, {
    search?: string | undefined;
    city?: string | undefined;
    limit?: number | undefined;
    lat?: string | undefined;
    lng?: string | undefined;
    isOpen?: string | undefined;
    page?: number | undefined;
}>;
//# sourceMappingURL=businesses.validation.d.ts.map