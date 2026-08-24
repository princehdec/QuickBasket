import { z } from "zod";

const addressFields = {
  label: z.string().trim().min(2).max(50).optional(),
  addressLine1: z.string().trim().min(3).max(500),
  addressLine2: z.string().trim().max(500).optional(),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().max(100).optional(),
  pincode: z.string().trim().regex(/^\d{5,10}$/, "Invalid pincode").optional(),
  latitude: z.string().trim().max(20).optional(),
  longitude: z.string().trim().max(20).optional(),
  isDefault: z.boolean().optional(),
};

export const createAddressSchema = z.object(addressFields);
export const updateAddressSchema = z.object({
  ...addressFields,
  addressLine1: addressFields.addressLine1.optional(),
  city: addressFields.city.optional(),
});
