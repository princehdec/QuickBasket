import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { users } from "./users";

export const prescriptionReviewStatusEnum = pgEnum("prescription_review_status", ["pending", "approved", "rejected"]);

export const prescriptionReviews = pgTable(
  "prescription_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").notNull().unique().references(() => orders.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    documentUrl: text("document_url").notNull(),
    status: prescriptionReviewStatusEnum("status").notNull().default("pending"),
    reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "set null" }),
    rejectionReason: text("rejection_reason"),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("prescription_reviews_status_idx").on(table.status),
    index("prescription_reviews_customer_idx").on(table.customerId),
  ],
);

export type PrescriptionReview = typeof prescriptionReviews.$inferSelect;
export type NewPrescriptionReview = typeof prescriptionReviews.$inferInsert;
