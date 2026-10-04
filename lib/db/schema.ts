import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
  boolean,
  primaryKey,
  AnyPgColumn,
} from "drizzle-orm/pg-core";

// ───────────────────────── Products ─────────────────────────

export const productStatusEnum = pgEnum("product_status", ["draft", "active", "archived"]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: productStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Descriptive, non-purchasable specs (e.g. "Material" -> "Full-grain leather")
export const productMetadata = pgTable("product_metadata", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 100 }).notNull(),
  value: text("value").notNull(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  position: integer("position").notNull().default(0),
});

// ───────────────────── Options & Variants ─────────────────────

export const productOptions = pgTable("product_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(), // "Color", "Size"
  position: integer("position").notNull().default(0),
});

export const productOptionValues = pgTable("product_option_values", {
  id: uuid("id").primaryKey().defaultRandom(),
  optionId: uuid("option_id")
    .notNull()
    .references(() => productOptions.id, { onDelete: "cascade" }),
  value: varchar("value", { length: 100 }).notNull(), // "Black", "M"
  position: integer("position").notNull().default(0),
});

// `in_stock` ships from `stock` on hand; `made_to_order` is out of ready
// stock but can still be handmade within `leadTimeDays`; `unavailable`
// cannot be purchased at all right now.
export const variantAvailabilityEnum = pgEnum("variant_availability", [
  "in_stock",
  "made_to_order",
  "unavailable",
]);

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  availability: variantAvailabilityEnum("availability").notNull().default("in_stock"),
  // Only meaningful when `availability` is `made_to_order`.
  leadTimeDays: integer("lead_time_days"),
  weightGrams: integer("weight_grams"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productVariantOptions = pgTable(
  "product_variant_options",
  {
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    optionValueId: uuid("option_value_id")
      .notNull()
      .references(() => productOptionValues.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.variantId, t.optionValueId] })]
);

// ───────────────────── Categories & Collections ─────────────────────

export const categoryTypeEnum = pgEnum("category_type", ["category", "collection"]);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, { onDelete: "set null" }),
  type: categoryTypeEnum("type").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productCategories = pgTable(
  "product_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.categoryId] })]
);

// ───────────────────── Addresses ─────────────────────

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(), // references Supabase auth.users(id)
  fullName: varchar("full_name", { length: 255 }).notNull(),
  line1: varchar("line1", { length: 255 }).notNull(),
  line2: varchar("line2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 2 }).notNull(), // ISO 3166-1 alpha-2
  phone: varchar("phone", { length: 30 }),
  isDefaultShipping: boolean("is_default_shipping").notNull().default(false),
  isDefaultBilling: boolean("is_default_billing").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ───────────────────── Cart ─────────────────────

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"), // null for guest carts
  sessionToken: varchar("session_token", { length: 255 }), // lookup key for guest carts
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
});

// ───────────────────── Orders ─────────────────────

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "fulfilled",
  "cancelled",
  "refunded",
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"), // null for guest checkout
  status: orderStatusEnum("status").notNull().default("pending"),
  shippingAddressId: uuid("shipping_address_id").references(() => addresses.id),
  billingAddressId: uuid("billing_address_id").references(() => addresses.id),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).notNull().default("0"),
  taxTotal: numeric("tax_total", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("PLN"),
  placedAt: timestamp("placed_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  unitPriceSnapshot: numeric("unit_price_snapshot", { precision: 10, scale: 2 }).notNull(),
  productTitleSnapshot: varchar("product_title_snapshot", { length: 255 }).notNull(),
});

// ───────────────────── Payments ─────────────────────

export const paymentStatusEnum = pgEnum("payment_status", ["pending", "succeeded", "failed", "refunded"]);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 50 }).notNull(), // "stripe"
  providerPaymentId: varchar("provider_payment_id", { length: 255 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
