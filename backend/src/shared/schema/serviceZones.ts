import {
  boolean,
  decimal,
  index,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const serviceZones = pgTable(
  "service_zones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cityName: varchar("city_name", { length: 100 }).notNull(),
    stateName: varchar("state_name", { length: 100 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    radiusKm: decimal("radius_km", { precision: 5, scale: 2 }).notNull().default("5"),
    boundary: jsonb("boundary"),
    deliveryFeeRules: jsonb("delivery_fee_rules").notNull().default({}),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("service_zones_city_idx").on(table.cityName, table.stateName),
    index("service_zones_active_idx").on(table.isActive),
  ],
);

export type ServiceZone = typeof serviceZones.$inferSelect;
export type NewServiceZone = typeof serviceZones.$inferInsert;
