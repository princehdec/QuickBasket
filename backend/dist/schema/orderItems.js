import { pgTable, uuid, varchar, decimal, integer, boolean, timestamp, index, } from "drizzle-orm/pg-core";
import { orders } from "./orders.js";
export const orderItems = pgTable("order_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
        .notNull()
        .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id"),
    productName: varchar("product_name", { length: 200 }).notNull(),
    productUnit: varchar("product_unit", { length: 50 }),
    productImage: varchar("product_image", { length: 500 }),
    isVeg: boolean("is_veg").default(true),
    quantity: integer("quantity").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
    index("order_items_order_id_idx").on(table.orderId),
]);
//# sourceMappingURL=orderItems.js.map