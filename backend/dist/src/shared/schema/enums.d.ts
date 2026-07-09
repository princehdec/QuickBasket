export declare const userRoleEnum: import("drizzle-orm/pg-core").PgEnum<["customer", "admin", "business_owner", "delivery_partner"]>;
export declare const businessTypeEnum: import("drizzle-orm/pg-core").PgEnum<["GROCERY", "FOOD", "LAUNDRY", "PORTER"]>;
export declare const orderStatusEnum: import("drizzle-orm/pg-core").PgEnum<["placed", "confirmed", "preparing", "packed", "out_for_delivery", "delivered", "cancelled"]>;
export declare const paymentMethodEnum: import("drizzle-orm/pg-core").PgEnum<["upi", "credit_card", "debit_card", "cod"]>;
export declare const paymentStatusEnum: import("drizzle-orm/pg-core").PgEnum<["pending", "completed", "failed", "refunded"]>;
export declare const paymentGatewayEnum: import("drizzle-orm/pg-core").PgEnum<["razorpay", "stripe", "cashfree"]>;
export declare const discountTypeEnum: import("drizzle-orm/pg-core").PgEnum<["percentage", "flat"]>;
export declare const notificationTypeEnum: import("drizzle-orm/pg-core").PgEnum<["order_update", "offer", "system", "payment"]>;
//# sourceMappingURL=enums.d.ts.map