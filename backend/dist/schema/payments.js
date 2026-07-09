import { pgTable, uuid, varchar, text, decimal, timestamp, index, } from "drizzle-orm/pg-core";
import { orders } from "./orders.js";
import { paymentGatewayEnum } from "./enums.js";
export const payments = pgTable("payments", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
        .notNull()
        .references(() => orders.id, { onDelete: "cascade" }),
    gateway: paymentGatewayEnum("gateway").notNull(),
    gatewayPaymentId: varchar("gateway_payment_id", { length: 255 }),
    gatewayOrderId: varchar("gateway_order_id", { length: 255 }),
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("INR"),
    failureReason: text("failure_reason"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    index("payments_order_id_idx").on(table.orderId),
    index("payments_gateway_payment_id_idx").on(table.gatewayPaymentId),
]);
//# sourceMappingURL=payments.js.map