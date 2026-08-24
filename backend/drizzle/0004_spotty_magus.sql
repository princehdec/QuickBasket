CREATE TYPE "public"."prescription_review_event_type" AS ENUM('submitted', 'approved', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."prescription_submission_status" AS ENUM('pending', 'approved', 'rejected', 'expired');--> statement-breakpoint
CREATE TABLE "prescription_review_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"event_type" "prescription_review_event_type" NOT NULL,
	"actor_id" uuid,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prescription_submission_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "prescription_submission_items_unique" UNIQUE("submission_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "prescription_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"business_id" uuid NOT NULL,
	"document_key" text NOT NULL,
	"document_file_name" varchar(255) NOT NULL,
	"document_mime_type" varchar(100) NOT NULL,
	"document_size_bytes" integer NOT NULL,
	"status" "prescription_submission_status" DEFAULT 'pending' NOT NULL,
	"reviewer_id" uuid,
	"rejection_reason" text,
	"reviewed_at" timestamp,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "prescription_submission_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "prescription_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "prescription_review_events" ADD CONSTRAINT "prescription_review_events_submission_id_prescription_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."prescription_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_review_events" ADD CONSTRAINT "prescription_review_events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_submission_items" ADD CONSTRAINT "prescription_submission_items_submission_id_prescription_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."prescription_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_submission_items" ADD CONSTRAINT "prescription_submission_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_submissions" ADD CONSTRAINT "prescription_submissions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_submissions" ADD CONSTRAINT "prescription_submissions_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_submissions" ADD CONSTRAINT "prescription_submissions_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "prescription_review_events_submission_idx" ON "prescription_review_events" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "prescription_review_events_created_at_idx" ON "prescription_review_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "prescription_submission_items_submission_idx" ON "prescription_submission_items" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "prescription_submission_items_product_idx" ON "prescription_submission_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "prescription_submissions_customer_idx" ON "prescription_submissions" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "prescription_submissions_business_idx" ON "prescription_submissions" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "prescription_submissions_status_idx" ON "prescription_submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "prescription_submissions_expires_at_idx" ON "prescription_submissions" USING btree ("expires_at");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_prescription_submission_id_prescription_submissions_id_fk" FOREIGN KEY ("prescription_submission_id") REFERENCES "public"."prescription_submissions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_prescription_submission_idx" ON "orders" USING btree ("prescription_submission_id");