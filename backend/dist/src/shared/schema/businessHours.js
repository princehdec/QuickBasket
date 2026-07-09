import { pgTable, uuid, integer, varchar, boolean, timestamp, index, uniqueIndex, } from "drizzle-orm/pg-core";
import { businesses } from "./businesses.js";
export const businessHours = pgTable("business_hours", {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businesses.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(),
    openTime: varchar("open_time", { length: 10 }).notNull(),
    closeTime: varchar("close_time", { length: 10 }).notNull(),
    isClosed: boolean("is_closed").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    uniqueIndex("business_hours_business_day_idx").on(table.businessId, table.dayOfWeek),
    index("business_hours_business_id_idx").on(table.businessId),
]);
//# sourceMappingURL=businessHours.js.map