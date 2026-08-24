import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { businesses } from "./businesses";
import { products } from "./products";
import { users } from "./users";

export const prescriptionSubmissionStatusEnum = pgEnum(
  "prescription_submission_status",
  ["pending", "approved", "rejected", "expired"],
);

export const prescriptionReviewEventTypeEnum = pgEnum(
  "prescription_review_event_type",
  ["submitted", "approved", "rejected", "expired"],
);

export const prescriptionSubmissions = pgTable(
  "prescription_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    documentKey: text("document_key").notNull(),
    documentFileName: varchar("document_file_name", { length: 255 }).notNull(),
    documentMimeType: varchar("document_mime_type", { length: 100 }).notNull(),
    documentSizeBytes: integer("document_size_bytes").notNull(),
    status: prescriptionSubmissionStatusEnum("status")
      .notNull()
      .default("pending"),
    reviewerId: uuid("reviewer_id").references(() => users.id, {
      onDelete: "set null",
    }),
    rejectionReason: text("rejection_reason"),
    reviewedAt: timestamp("reviewed_at"),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("prescription_submissions_customer_idx").on(table.customerId),
    index("prescription_submissions_business_idx").on(table.businessId),
    index("prescription_submissions_status_idx").on(table.status),
    index("prescription_submissions_expires_at_idx").on(table.expiresAt),
  ],
);

export const prescriptionSubmissionItems = pgTable(
  "prescription_submission_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => prescriptionSubmissions.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("prescription_submission_items_unique").on(
      table.submissionId,
      table.productId,
    ),
    index("prescription_submission_items_submission_idx").on(table.submissionId),
    index("prescription_submission_items_product_idx").on(table.productId),
  ],
);

export const prescriptionReviewEvents = pgTable(
  "prescription_review_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => prescriptionSubmissions.id, { onDelete: "cascade" }),
    eventType: prescriptionReviewEventTypeEnum("event_type").notNull(),
    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("prescription_review_events_submission_idx").on(table.submissionId),
    index("prescription_review_events_created_at_idx").on(table.createdAt),
  ],
);

export type PrescriptionSubmission = typeof prescriptionSubmissions.$inferSelect;
export type NewPrescriptionSubmission = typeof prescriptionSubmissions.$inferInsert;
export type PrescriptionSubmissionItem = typeof prescriptionSubmissionItems.$inferSelect;
export type NewPrescriptionSubmissionItem = typeof prescriptionSubmissionItems.$inferInsert;
export type PrescriptionReviewEvent = typeof prescriptionReviewEvents.$inferSelect;
export type NewPrescriptionReviewEvent = typeof prescriptionReviewEvents.$inferInsert;
