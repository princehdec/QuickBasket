import { z } from "zod";
export const productQuerySchema = z.object({
    storeId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    search: z.string().optional(),
    isVeg: z
        .string()
        .transform((v) => v === "true")
        .optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
});
//# sourceMappingURL=products.validation.js.map