import {
  boolean,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const otpChallenges = pgTable(
  "otp_challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: varchar("phone", { length: 15 }).notNull(),
    codeHash: varchar("code_hash", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(5),
    consumedAt: timestamp("consumed_at"),
    isBlocked: boolean("is_blocked").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("otp_challenges_phone_idx").on(table.phone),
    index("otp_challenges_expiry_idx").on(table.expiresAt),
  ],
);

export type OtpChallenge = typeof otpChallenges.$inferSelect;
export type NewOtpChallenge = typeof otpChallenges.$inferInsert;
