import { pgTable, uuid, varchar, boolean, timestamp, index, } from "drizzle-orm/pg-core";
import { users } from "./users.js";
export const deliveryPartners = pgTable("delivery_partners", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .unique()
        .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 15 }).notNull(),
    vehicle: varchar("vehicle", { length: 100 }),
    vehicleNumber: varchar("vehicle_number", { length: 50 }),
    isOnline: boolean("is_online").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    currentLatitude: varchar("current_latitude", { length: 20 }),
    currentLongitude: varchar("current_longitude", { length: 20 }),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    index("delivery_partners_is_online_idx").on(table.isOnline),
]);
//# sourceMappingURL=deliveryPartners.js.map