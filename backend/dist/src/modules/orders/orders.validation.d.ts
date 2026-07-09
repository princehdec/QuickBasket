import { z } from "zod";
export declare const placeOrderSchema: z.ZodObject<{
    storeId: z.ZodString;
    addressId: z.ZodString;
    paymentMethod: z.ZodEnum<["upi", "credit_card", "debit_card", "cod"]>;
    couponCode: z.ZodOptional<z.ZodString>;
    deliveryNotes: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        quantity: number;
    }, {
        productId: string;
        quantity: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    addressId: string;
    paymentMethod: "upi" | "credit_card" | "debit_card" | "cod";
    storeId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
    couponCode?: string | undefined;
    deliveryNotes?: string | undefined;
}, {
    addressId: string;
    paymentMethod: "upi" | "credit_card" | "debit_card" | "cod";
    storeId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
    couponCode?: string | undefined;
    deliveryNotes?: string | undefined;
}>;
//# sourceMappingURL=orders.validation.d.ts.map