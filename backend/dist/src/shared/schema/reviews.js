import { pgTable, uuid, integer, text, boolean, timestamp, index, } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { businesses } from "./businesses.js";
import { products } from "./products.js";
export const reviews = pgTable("reviews", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businesses.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
        .references(() => products.id, { onDelete: "set null" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    isActive: boolean("is_active").notNull().default(true),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    index("reviews_business_id_idx").on(table.businessId),
    index("reviews_user_id_idx").on(table.userId),
    index("reviews_product_id_idx").on(table.productId),
]);
//# sourceMappingURL=reviews.js.map