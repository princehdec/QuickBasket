import { z } from "zod";
export declare const productQuerySchema: z.ZodObject<{
    storeId: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    isVeg: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    search?: string | undefined;
    categoryId?: string | undefined;
    isVeg?: boolean | undefined;
    storeId?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
}, {
    search?: string | undefined;
    categoryId?: string | undefined;
    isVeg?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    storeId?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
}>;
//# sourceMappingURL=products.validation.d.ts.map