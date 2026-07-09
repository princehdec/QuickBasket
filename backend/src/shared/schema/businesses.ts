import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { businessTypeEnum } from "./enums";

export const businesses = pgTable(
  "businesses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .references(() => users.id, { onDelete: "set null" }),
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    description: text("description"),
    businessType: businessTypeEnum("business_type").notNull(),
    phone: varchar("phone", { length: 15 }),
    email: varchar("email", { length: 255 }),
    logo: text("logo"),
    banner: text("banner"),
    address: text("address"),
    city: varchar("city", { length: 100 }).notNull(),
    latitude: varchar("latitude", { length: 20 }),
    longitude: varchar("longitude", { length: 20 }),
    rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
    totalRatings: varchar("total_ratings", { length: 10 }).default("0"),
    deliveryFee: varchar("delivery_fee", { length: 20 }).default("0"),
    minOrder: varchar("min_order", { length: 20 }).default("0"),
    tags: jsonb("tags").$type<string[]>().default([]),
    isActive: boolean("is_active").notNull().default(true),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("businesses_slug_idx").on(table.slug),
    index("businesses_city_idx").on(table.city),
    index("businesses_type_idx").on(table.businessType),
    index("businesses_owner_id_idx").on(table.ownerId),
  ]
);

export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
