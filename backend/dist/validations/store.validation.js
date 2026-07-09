import { z } from "zod";
export const storeQuerySchema = z.object({
    city: z.string().optional(),
    lat: z.string().optional(),
    lng: z.string().optional(),
    search: z.string().optional(),
    isOpen: z
        .string()
        .transform((v) => v === "true")
        .optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
});
//# sourceMappingURL=store.validation.js.map