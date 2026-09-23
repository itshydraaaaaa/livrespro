import {
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Users table with native authentication support.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 180 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Categories table for multi-product bookstore taxonomy.
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  parentId: int("parentId"),
  sortOrder: int("sortOrder").default(0).notNull(),
  seoTitle: varchar("seoTitle", { length: 180 }),
  seoDescription: varchar("seoDescription", { length: 320 }),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Authors table for book author profiles.
 */
export const authors = mysqlTable("authors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  biography: text("biography"),
  photo: text("photo"),
  website: varchar("website", { length: 300 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Products table supporting physical books, digital guides, and multi-format inventory.
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  sku: varchar("sku", { length: 80 }),
  shortDescription: text("shortDescription"),
  description: text("description").notNull(),
  descriptionHtml: text("descriptionHtml"),
  productType: varchar("productType", { length: 80 }).default("Livre").notNull(),
  format: mysqlEnum("format", [
    "PHYSICAL_BOOK",
    "DIGITAL_BOOK",
    "EBOOK",
    "AUDIOBOOK",
    "OTHER",
  ]).default("PHYSICAL_BOOK").notNull(),
  price: varchar("price", { length: 32 }).notNull(), // e.g. "65.00"
  compareAtPrice: varchar("compareAtPrice", { length: 32 }),
  currency: varchar("currency", { length: 10 }).default("TND").notNull(),
  stockQuantity: int("stockQuantity").default(100).notNull(),
  availabilityStatus: mysqlEnum("availabilityStatus", [
    "in_stock",
    "out_of_stock",
    "preorder",
  ]).default("in_stock").notNull(),
  isbn: varchar("isbn", { length: 40 }),
  publisher: varchar("publisher", { length: 180 }),
  publicationDate: varchar("publicationDate", { length: 40 }),
  language: varchar("language", { length: 40 }).default("Français").notNull(),
  pageCount: int("pageCount"),
  coverImage: text("coverImage"),
  categoryId: int("categoryId"),
  featured: int("featured").default(0).notNull(), // 0 = false, 1 = true
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("published").notNull(),
  seoTitle: varchar("seoTitle", { length: 180 }),
  seoDescription: varchar("seoDescription", { length: 320 }),
  metadata: json("metadata"), // e.g. case studies, educator companions, tags
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Junction table connecting products to one or more authors.
 */
export const productAuthors = mysqlTable("product_authors", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  authorId: int("authorId").notNull(),
  role: varchar("role", { length: 64 }).default("Auteur").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

/**
 * Secondary/gallery images for products.
 */
export const productImages = mysqlTable("product_images", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 255 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPrimary: int("isPrimary").default(0).notNull(),
});

/**
 * Orders table supporting multi-product Cash-on-Delivery and scalable fulfillment.
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 64 }).notNull().unique(),
  customerFirstName: varchar("customerFirstName", { length: 120 }).notNull(),
  customerLastName: varchar("customerLastName", { length: 120 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 80 }).notNull(),
  deliveryAddress: text("deliveryAddress").notNull(),
  city: varchar("city", { length: 120 }),
  governorate: varchar("governorate", { length: 120 }),
  postalCode: varchar("postalCode", { length: 20 }),
  orderNotes: text("orderNotes"),
  isEducator: int("isEducator").default(0).notNull(),
  subtotal: varchar("subtotal", { length: 32 }).default("0.00").notNull(),
  shippingCost: varchar("shippingCost", { length: 32 }).default("7.00").notNull(),
  discountAmount: varchar("discountAmount", { length: 32 }).default("0.00").notNull(),
  totalAmount: varchar("totalAmount", { length: 32 }).default("0.00").notNull(),
  currency: varchar("currency", { length: 10 }).default("TND").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 64 }).default("cash_on_delivery").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  status: mysqlEnum("status", ["new", "confirmed", "processing", "shipped", "delivered", "cancelled"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Order line items preserving historical purchase prices and quantities.
 */
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId"),
  productSlug: varchar("productSlug", { length: 180 }).notNull(),
  productTitle: varchar("productTitle", { length: 300 }).notNull(),
  format: varchar("format", { length: 80 }).default("Livre physique").notNull(),
  unitPrice: varchar("unitPrice", { length: 32 }).notNull(),
  quantity: int("quantity").default(1).notNull(),
  subtotal: varchar("subtotal", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Reusable editorial content blocks.
 */
export const contentSections = mysqlTable("content_sections", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 80 }).notNull().unique(),
  eyebrow: varchar("eyebrow", { length: 120 }),
  title: varchar("title", { length: 240 }).notNull(),
  body: text("body"),
  ctaLabel: varchar("ctaLabel", { length: 80 }),
  ctaHref: varchar("ctaHref", { length: 500 }),
  imageUrl: text("imageUrl"),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Per-page SEO metadata editable from the admin dashboard.
 */
export const seoPages = mysqlTable("seo_pages", {
  id: int("id").autoincrement().primaryKey(),
  path: varchar("path", { length: 500 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  description: varchar("description", { length: 320 }).notNull(),
  ogTitle: varchar("ogTitle", { length: 160 }),
  ogDescription: varchar("ogDescription", { length: 320 }),
  canonicalUrl: varchar("canonicalUrl", { length: 500 }),
  robots: mysqlEnum("robots", ["index", "noindex"]).default("index").notNull(),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Privacy-first consented analytics events.
 */
export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  eventType: varchar("eventType", { length: 64 }).notNull(),
  path: varchar("path", { length: 500 }).notNull(),
  referrer: varchar("referrer", { length: 500 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Inferred TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export type Author = typeof authors.$inferSelect;
export type InsertAuthor = typeof authors.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type ProductAuthor = typeof productAuthors.$inferSelect;
export type InsertProductAuthor = typeof productAuthors.$inferInsert;

export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

export type ContentSection = typeof contentSections.$inferSelect;
export type InsertContentSection = typeof contentSections.$inferInsert;

export type SeoPage = typeof seoPages.$inferSelect;
export type InsertSeoPage = typeof seoPages.$inferInsert;

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;
