import { z } from "zod";

const businessTypeEnum = z.enum([
  "GROCERY",
  "FOOD",
  "PHARMACY",
  "ELECTRONICS",
  "PLUMBER",
  "FASHION",
  "BEAUTY",
  "PETS",
  "FLOWERS",
  "STATIONERY",
  "LAUNDRY",
  "PORTER",
  "OTHER",
]);

export const createBusinessSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(200),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().max(2000).optional(),
  businessType: businessTypeEnum,
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  logo: z.string().url("Invalid URL format").optional(),
  banner: z.string().url("Invalid URL format").optional(),
  address: z.string().max(500).optional(),
  city: z.string().min(1, "City is required").max(100),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  deliveryFee: z.string().optional(),
  minOrder: z.string().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const updateBusinessSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  description: z.string().max(2000).optional(),
  businessType: businessTypeEnum.optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  logo: z.string().url("Invalid URL format").optional(),
  banner: z.string().url("Invalid URL format").optional(),
  address: z.string().max(500).optional(),
  city: z.string().min(1).max(100).optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  deliveryFee: z.string().optional(),
  minOrder: z.string().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  isActive: z.boolean().optional(),
});

export const storeQuerySchema = z.object({
  city: z.string().optional(),
  businessType: businessTypeEnum.optional(),
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
