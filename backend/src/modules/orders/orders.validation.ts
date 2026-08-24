import { z } from "zod";

export const createOrderSchema = z.object({
  businessId: z.string().uuid(),
  addressId: z.string().uuid(),
  paymentMethod: z.enum(["upi", "credit_card", "debit_card", "net_banking", "wallet"]),
  prescriptionSubmissionId: z.string().uuid().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(100),
      }),
    )
    .min(1)
    .max(100),
  deliveryNotes: z.string().max(500).optional(),
});

export const orderIdSchema = z.object({
  id: z.string().uuid(),
});
