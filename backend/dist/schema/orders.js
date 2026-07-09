import { pgTable, uuid, varchar, text, decimal, timestamp, index, } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { businesses } from "./businesses.js";
import { addresses } from "./addresses.js";
import { orderStatusEnum, paymentMethodEnum, paymentStatusEnum, } from "./enums.js";
export const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businesses.id, { onDelete: "cascade" }),
    addressId: uuid("address_id")
        .notNull()
        .references(() => addresses.id, { onDelete: "cascade" }),
    status: orderStatusEnum("status").notNull().default("placed"),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    paymentStatus: paymentStatusEnum("payment_status")
        .notNull()
        .default("pending"),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 })
        .notNull()
        .default("0"),
    platformFee: decimal("platform_fee", { precision: 10, scale: 2 })
        .notNull()
        .default("0"),
    taxes: decimal("taxes", { precision: 10, scale: 2 })
        .notNull()
        .default("0"),
    discount: decimal("discount", { precision: 10, scale: 2 })
        .notNull()
        .default("0"),
    couponCode: varchar("coupon_code", { length: 50 }),
    couponDiscount: decimal("coupon_discount", { precision: 10, scale: 2 })
        .notNull()
        .default("0"),
    grandTotal: decimal("grand_total", { precision: 10, scale: 2 }).notNull(),
    deliveryNotes: text("delivery_notes"),
    scheduledAt: timestamp("scheduled_at"),
    deliveredAt: timestamp("delivered_at"),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    index("orders_user_id_idx").on(table.userId),
    index("orders_business_id_idx").on(table.businessId),
    index("orders_status_idx").on(table.status),
    index("orders_created_at_idx").on(table.createdAt),
]);
//# sourceMappingURL=orders.js.map