import { z } from "zod";

export const createProductSchema = z.object({
  businessId: z.string().uuid("Invalid business ID"),
  categoryId: z.string().uuid("Invalid category ID"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(200),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    ),
  description: z.string().max(2000).optional(),
  unit: z.string().max(50).optional(),
  brand: z.string().max(100).optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  originalPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .optional(),
  images: z.array(z.string()).max(10).optional(),
  isVeg: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
});

export const updateProductSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID").optional(),
  name: z.string().min(2).max(200).optional(),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    )
    .optional(),
  description: z.string().max(2000).optional(),
  unit: z.string().max(50).optional(),
  brand: z.string().max(100).optional(),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .optional(),
  originalPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .optional(),
  images: z.array(z.string()).max(10).optional(),
  isVeg: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const productQuerySchema = z.object({
  businessId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  isAvailable: z
    .string()
    .transform((v) => v === "true")
    .optional(),
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
