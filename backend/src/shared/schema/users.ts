import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: varchar("full_name", { length: 100 }),
    phone: varchar("phone", { length: 15 }).notNull(),
    email: varchar("email", { length: 255 }),
    avatar: text("avatar"),
    role: userRoleEnum("role").notNull().default("customer"),
    isVerified: boolean("is_verified").notNull().default(false),
    passwordHash: text("password_hash"),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_phone_idx").on(table.phone),
    uniqueIndex("users_email_idx")
      .on(table.email)
      .where(sql`email IS NOT NULL`),
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
