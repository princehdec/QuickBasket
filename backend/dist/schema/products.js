import { pgTable, uuid, varchar, text, decimal, boolean, integer, timestamp, index, uniqueIndex, } from "drizzle-orm/pg-core";
import { businesses } from "./businesses.js";
import { categories } from "./categories.js";
export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businesses.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
        .notNull()
        .references(() => categories.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    description: text("description"),
    unit: varchar("unit", { length: 50 }),
    brand: varchar("brand", { length: 100 }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
    images: text("images").array(),
    isVeg: boolean("is_veg").default(true),
    isBestseller: boolean("is_bestseller").notNull().default(false),
    stock: integer("stock").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    uniqueIndex("products_business_slug_idx").on(table.businessId, table.slug),
    index("products_business_id_idx").on(table.businessId),
    index("products_category_id_idx").on(table.categoryId),
    index("products_is_active_idx").on(table.isActive),
]);
//# sourceMappingURL=products.js.map