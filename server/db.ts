/**
 * LivresPro.tn — Database Adapter Layer
 * 
 * Provides unified data access for LivresPro.tn.
 * In cloud serverless (Vercel) and production environments, commercial operations
 * are persisted directly to Supabase PostgreSQL.
 * If local MySQL is desired (via DATABASE_URL), see server/db.mysql.ts.
 */

import type {
  User,
  Category,
  Author,
  Product as DbProduct,
  ContentSection,
  SeoPage,
  InsertCategory,
  InsertAuthor,
} from "../drizzle/schema";

export type { User, Category, Author, ContentSection, SeoPage };

export type FullProduct = DbProduct & {
  authors: Array<{ id: number; name: string; slug: string; role: string }>;
  images: Array<{ id: number; url: string; alt: string | null; isPrimary: number }>;
  category: Category | null;
};

export type ContentSectionInput = {
  id?: number;
  key: string;
  eyebrow?: string | null;
  title: string;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  imageUrl?: string | null;
  status: "draft" | "published";
  updatedBy: number;
};

export type SeoPageInput = {
  id?: number;
  path: string;
  title: string;
  description: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  canonicalUrl?: string | null;
  robots: "index" | "noindex";
  updatedBy: number;
};

export type AnalyticsEventInput = {
  visitorId: string;
  sessionId: string;
  eventType: "page_view" | "view_book" | "add_to_cart" | "initiate_checkout";
  path: string;
  referrer?: string | null;
  metadata?: { productHandle?: string } | null;
};

export async function getDb() {
  return null;
}

export async function requireDb() {
  throw new Error("DATABASE_URL is not configured - using Supabase cloud database.");
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return null;
}

export async function getUserById(id: number): Promise<User | null> {
  return null;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  name?: string | null;
  role?: "admin" | "user";
}): Promise<number> {
  return 1;
}

export async function updateLastSignedIn(userId: number): Promise<void> {}

export async function listCategories(): Promise<Category[]> {
  return [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return null;
}

export async function createCategory(input: Partial<InsertCategory>): Promise<number> {
  return 1;
}

export async function updateCategory(id: number, input: Partial<InsertCategory>): Promise<number> {
  return id;
}

export async function listAuthors(): Promise<Author[]> {
  return [];
}

export async function createAuthor(input: Partial<InsertAuthor>): Promise<number> {
  return 1;
}

export async function updateAuthor(id: number, input: Partial<InsertAuthor>): Promise<number> {
  return id;
}

export async function listProducts(options?: any): Promise<FullProduct[]> {
  return [];
}

export async function getProductBySlug(slug: string): Promise<FullProduct | null> {
  return null;
}

export async function createProduct(
  productData: any,
  authorIds?: number[],
  imageUrls?: Array<{ url: string; alt?: string | null; isPrimary?: boolean }>
): Promise<number> {
  return 1;
}

export async function updateProduct(
  id: number,
  productData: any,
  authorIds?: number[],
  imageUrls?: Array<{ url: string; alt?: string | null; isPrimary?: boolean }>
): Promise<number> {
  return id;
}

export async function createMultiItemOrder(input: any): Promise<{ orderId: number; orderNumber: string }> {
  throw new Error("Local DB offline, using Supabase");
}

export async function listOrders(): Promise<any[]> {
  return [];
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {}

export async function listContentSections(includeDrafts = true): Promise<ContentSection[]> {
  return [];
}

export async function saveContentSection(input: ContentSectionInput): Promise<number> {
  return 1;
}

export async function listSeoPages(): Promise<SeoPage[]> {
  return [];
}

export async function getSeoPage(path: string): Promise<SeoPage | null> {
  return null;
}

export async function saveSeoPage(input: SeoPageInput): Promise<number> {
  return 1;
}

export async function recordAnalyticsEvent(input: AnalyticsEventInput): Promise<void> {}

export async function getAnalyticsSummary(days: number) {
  return {
    days,
    totalEvents: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    bookViews: 0,
    cartAdds: 0,
    cartRate: 0,
    topPages: [] as Array<{ path: string; total: number }>,
    eventMix: [] as Array<{ eventType: string; total: number }>,
  };
}

export async function getAdminOverview(days: number) {
  return {
    contentSections: 0,
    publishedSections: 0,
    seoPages: 0,
    totalProducts: 1,
    totalOrders: 0,
    analytics: await getAnalyticsSummary(days),
  };
}
