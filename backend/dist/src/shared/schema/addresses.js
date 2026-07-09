import { pgTable, uuid, varchar, text, boolean, timestamp, index, } from "drizzle-orm/pg-core";
import { users } from "./users.js";
export const addresses = pgTable("addresses", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 50 }).notNull().default("Home"),
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }),
    pincode: varchar("pincode", { length: 10 }),
    latitude: varchar("latitude", { length: 20 }),
    longitude: varchar("longitude", { length: 20 }),
    isDefault: boolean("is_default").notNull().default(false),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    index("addresses_user_id_idx").on(table.userId),
]);
//# sourceMappingURL=addresses.js.map