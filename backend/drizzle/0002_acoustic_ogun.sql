CREATE TYPE "public"."delivery_job_source" AS ENUM('managed', 'third_party');--> statement-breakpoint
CREATE TYPE "public"."delivery_job_status" AS ENUM('unassigned', 'offered', 'accepted', 'picked_up', 'out_for_delivery', 'delivered', 'failed', 'reassigned');--> statement-breakpoint
CREATE TYPE "public"."prescription_review_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."settlement_status" AS ENUM('draft', 'approved', 'processing', 'paid', 'failed');--> statement-breakpoint
CREATE TABLE "delivery_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"partner_id" uuid,
	"source" "delivery_job_source" DEFAULT 'managed' NOT NULL,
	"status" "delivery_job_status" DEFAULT 'unassigned' NOT NULL,
	"earnings" varchar(20) DEFAULT '0' NOT NULL,
	"failure_reason" text,
	"proof_of_delivery_url" text,
	"accepted_at" timestamp,
	"picked_up_at" timestamp,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "delivery_jobs_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "otp_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(15) NOT NULL,
	"code_hash" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"consumed_at" timestamp,
	"is_blocked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prescription_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"document_url" text NOT NULL,
	"status" "prescription_review_status" DEFAULT 'pending' NOT NULL,
	"reviewer_id" uuid,
	"rejection_reason" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "prescription_reviews_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "service_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city_name" varchar(100) NOT NULL,
	"state_name" varchar(100) NOT NULL,
	"name" varchar(160) NOT NULL,
	"radius_km" numeric(5, 2) DEFAULT '5' NOT NULL,
	"boundary" jsonb,
	"delivery_fee_rules" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settlement_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"gross_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"commission_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"refund_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"adjustment_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"net_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"status" "settlement_status" DEFAULT 'draft' NOT NULL,
	"payout_reference" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "delivery_jobs" ADD CONSTRAINT "delivery_jobs_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_jobs" ADD CONSTRAINT "delivery_jobs_partner_id_delivery_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."delivery_partners"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_reviews" ADD CONSTRAINT "prescription_reviews_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_reviews" ADD CONSTRAINT "prescription_reviews_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_reviews" ADD CONSTRAINT "prescription_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlement_batches" ADD CONSTRAINT "settlement_batches_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "delivery_jobs_partner_idx" ON "delivery_jobs" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "delivery_jobs_status_idx" ON "delivery_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "otp_challenges_phone_idx" ON "otp_challenges" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "otp_challenges_expiry_idx" ON "otp_challenges" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "prescription_reviews_status_idx" ON "prescription_reviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "prescription_reviews_customer_idx" ON "prescription_reviews" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "service_zones_city_idx" ON "service_zones" USING btree ("city_name","state_name");--> statement-breakpoint
CREATE INDEX "service_zones_active_idx" ON "service_zones" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "settlement_batches_business_idx" ON "settlement_batches" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "settlement_batches_period_idx" ON "settlement_batches" USING btree ("period_start","period_end");