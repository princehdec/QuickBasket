import { pgTable, uuid, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { businesses } from "./businesses.js";
import { products } from "./products.js";
export const favorites = pgTable("favorites", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businesses.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
        .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
    uniqueIndex("favorites_user_business_product_idx").on(table.userId, table.businessId, table.productId),
    index("favorites_user_id_idx").on(table.userId),
]);
//# sourceMappingURL=favorites.js.map