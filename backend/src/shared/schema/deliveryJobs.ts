import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { deliveryPartners } from "./deliveryPartners";
import { orders } from "./orders";

export const deliveryJobSourceEnum = pgEnum("delivery_job_source", ["managed", "third_party"]);
export const deliveryJobStatusEnum = pgEnum("delivery_job_status", [
  "unassigned",
  "offered",
  "accepted",
  "picked_up",
  "out_for_delivery",
  "delivered",
  "failed",
  "reassigned",
]);

export const deliveryJobs = pgTable(
  "delivery_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").notNull().unique().references(() => orders.id, { onDelete: "cascade" }),
    partnerId: uuid("partner_id").references(() => deliveryPartners.id, { onDelete: "set null" }),
    source: deliveryJobSourceEnum("source").notNull().default("managed"),
    status: deliveryJobStatusEnum("status").notNull().default("unassigned"),
    earnings: varchar("earnings", { length: 20 }).notNull().default("0"),
    failureReason: text("failure_reason"),
    proofOfDeliveryUrl: text("proof_of_delivery_url"),
    acceptedAt: timestamp("accepted_at"),
    pickedUpAt: timestamp("picked_up_at"),
    deliveredAt: timestamp("delivered_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("delivery_jobs_partner_idx").on(table.partnerId),
    index("delivery_jobs_status_idx").on(table.status),
  ],
);

export type DeliveryJob = typeof deliveryJobs.$inferSelect;
export type NewDeliveryJob = typeof deliveryJobs.$inferInsert;
