ALTER TABLE "products" ADD COLUMN "attributes" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "requires_prescription" boolean DEFAULT false NOT NULL;