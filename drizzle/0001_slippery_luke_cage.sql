CREATE TYPE "public"."variant_availability" AS ENUM('in_stock', 'made_to_order', 'unavailable');--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "availability" "variant_availability" DEFAULT 'in_stock' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "lead_time_days" integer;