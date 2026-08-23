import {
  decimal,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { businesses } from "./businesses";

export const settlementStatusEnum = pgEnum("settlement_status", ["draft", "approved", "processing", "paid", "failed"]);

export const settlementBatches = pgTable(
  "settlement_batches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    periodStart: timestamp("period_start").notNull(),
    periodEnd: timestamp("period_end").notNull(),
    grossAmount: decimal("gross_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    commissionAmount: decimal("commission_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    refundAmount: decimal("refund_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    adjustmentAmount: decimal("adjustment_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    netAmount: decimal("net_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    status: settlementStatusEnum("status").notNull().default("draft"),
    payoutReference: text("payout_reference"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("settlement_batches_business_idx").on(table.businessId),
    index("settlement_batches_period_idx").on(table.periodStart, table.periodEnd),
  ],
);

export type SettlementBatch = typeof settlementBatches.$inferSelect;
export type NewSettlementBatch = typeof settlementBatches.$inferInsert;
