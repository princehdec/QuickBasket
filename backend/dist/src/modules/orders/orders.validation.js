import { z } from "zod";
export const placeOrderSchema = z.object({
    storeId: z.string().uuid(),
    addressId: z.string().uuid(),
    paymentMethod: z.enum(["upi", "credit_card", "debit_card", "cod"]),
    couponCode: z.string().max(50).optional(),
    deliveryNotes: z.string().max(500).optional(),
    items: z
        .array(z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
    }))
        .min(1, "At least one item is required"),
});
//# sourceMappingURL=orders.validation.js.map