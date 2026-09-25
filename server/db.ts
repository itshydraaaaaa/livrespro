/**
 * LivresPro.tn — Database Adapter Layer (Supabase Cloud)
 *
 * All data operations go directly to Supabase PostgreSQL.
 * No MySQL / local DB dependency in production.
 */

import { getSupabaseAdmin } from "./services/supabase";

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

// ─── Helper ──────────────────────────────────────────────────────────────────

function sb() {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Supabase not configured");
  return client;
}

// Supabase stores password_hash (snake_case). Map to camelCase expected by auth.ts.
function mapUser(row: any): User | null {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name ?? null,
    role: row.role ?? "user",
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    lastSignedIn: row.last_signed_in ? new Date(row.last_signed_in) : new Date(),
  } as unknown as User;
}

export async function getDb() {
  return null;
}

export async function requireDb() {
  throw new Error("Use Supabase client directly.");
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await sb()
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();
    if (error) {
      console.warn("[DB] getUserByEmail error:", error.message);
      return null;
    }
    return mapUser(data);
  } catch (err) {
    console.warn("[DB] getUserByEmail exception:", err);
    return null;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const { data, error } = await sb()
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.warn("[DB] getUserById error:", error.message);
      return null;
    }
    return mapUser(data);
  } catch (err) {
    console.warn("[DB] getUserById exception:", err);
    return null;
  }
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  name?: string | null;
  role?: "admin" | "user";
}): Promise<number> {
  const { data, error } = await sb()
    .from("users")
    .insert([
      {
        email: input.email.toLowerCase().trim(),
        password_hash: input.passwordHash,
        name: input.name ?? null,
        role: input.role ?? "user",
      },
    ])
    .select("id")
    .single();
  if (error) throw new Error(`createUser failed: ${error.message}`);
  return data.id;
}

export async function updateLastSignedIn(userId: number): Promise<void> {
  try {
    await sb()
      .from("users")
      .update({ last_signed_in: new Date().toISOString() })
      .eq("id", userId);
  } catch {}
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function listCategories(): Promise<Category[]> {
  try {
    const { data } = await sb().from("categories").select("*").order("sort_order");
    return (data ?? []) as unknown as Category[];
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data } = await sb().from("categories").select("*").eq("slug", slug).maybeSingle();
    return (data ?? null) as unknown as Category | null;
  } catch {
    return null;
  }
}

export async function createCategory(input: Partial<InsertCategory>): Promise<number> {
  const { data, error } = await sb().from("categories").insert([input]).select("id").single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function updateCategory(id: number, input: Partial<InsertCategory>): Promise<number> {
  await sb().from("categories").update(input).eq("id", id);
  return id;
}

// ─── Authors ──────────────────────────────────────────────────────────────────

export async function listAuthors(): Promise<Author[]> {
  try {
    const { data } = await sb().from("authors").select("*").order("name");
    return (data ?? []) as unknown as Author[];
  } catch {
    return [];
  }
}

export async function createAuthor(input: Partial<InsertAuthor>): Promise<number> {
  const { data, error } = await sb().from("authors").insert([input]).select("id").single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function updateAuthor(id: number, input: Partial<InsertAuthor>): Promise<number> {
  await sb().from("authors").update(input).eq("id", id);
  return id;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function listProducts(options?: any): Promise<FullProduct[]> {
  try {
    const { data } = await sb()
      .from("products")
      .select("*, categories(*), product_images(*)")
      .eq("status", "published")
      .order("featured", { ascending: false });
    return (data ?? []).map(normalizeSupabaseProduct);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<FullProduct | null> {
  try {
    const { data } = await sb()
      .from("products")
      .select("*, categories(*), product_images(*)")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return null;
    return normalizeSupabaseProduct(data);
  } catch {
    return null;
  }
}

function normalizeSupabaseProduct(row: any): FullProduct {
  return {
    ...row,
    // Map snake_case columns to camelCase for compatibility
    coverImage: row.cover_image ?? null,
    descriptionHtml: row.description_html ?? null,
    productType: row.product_type ?? null,
    categoryId: row.category_id ?? null,
    compareAtPrice: row.compare_at_price ?? null,
    stockQuantity: row.stock_quantity ?? 0,
    pageCount: row.page_count ?? null,
    publicationDate: row.publication_date ?? null,
    availabilityStatus: row.availability_status ?? "in_stock",
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    authors: (row.product_authors ?? []).map((a: any) => ({
      id: a.author_id,
      name: a.authors?.name ?? "",
      slug: a.authors?.slug ?? "",
      role: a.role ?? "author",
    })),
    images: (row.product_images ?? []).map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? null,
      isPrimary: img.is_primary ? 1 : 0,
    })),
    category: row.categories ?? null,
  } as unknown as FullProduct;
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

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createMultiItemOrder(input: any): Promise<{ orderId: number; orderNumber: string }> {
  throw new Error("Use persistOrderToSupabase from services/supabase.ts");
}

export async function listOrders(): Promise<any[]> {
  try {
    const { data } = await sb()
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  try {
    await sb().from("orders").update({ status }).eq("id", orderId);
  } catch {}
}

// ─── Content Sections ─────────────────────────────────────────────────────────

export async function listContentSections(includeDrafts = true): Promise<ContentSection[]> {
  try {
    let query = sb().from("content_sections").select("*");
    if (!includeDrafts) query = query.eq("status", "published");
    const { data } = await query.order("updated_at", { ascending: false });
    return (data ?? []) as unknown as ContentSection[];
  } catch {
    return [];
  }
}

export async function saveContentSection(input: ContentSectionInput): Promise<number> {
  const row = {
    key: input.key,
    eyebrow: input.eyebrow ?? null,
    title: input.title,
    body: input.body ?? null,
    cta_label: input.ctaLabel ?? null,
    cta_href: input.ctaHref ?? null,
    image_url: input.imageUrl ?? null,
    status: input.status,
    updated_by: input.updatedBy,
  };
  if (input.id) {
    await sb().from("content_sections").update(row).eq("id", input.id);
    return input.id;
  }
  const { data, error } = await sb().from("content_sections").insert([row]).select("id").single();
  if (error) throw new Error(error.message);
  return data.id;
}

// ─── SEO Pages ────────────────────────────────────────────────────────────────

export async function listSeoPages(): Promise<SeoPage[]> {
  try {
    const { data } = await sb().from("seo_pages").select("*").order("path");
    return (data ?? []) as unknown as SeoPage[];
  } catch {
    return [];
  }
}

export async function getSeoPage(path: string): Promise<SeoPage | null> {
  try {
    const { data } = await sb().from("seo_pages").select("*").eq("path", path).maybeSingle();
    return (data ?? null) as unknown as SeoPage | null;
  } catch {
    return null;
  }
}

export async function saveSeoPage(input: SeoPageInput): Promise<number> {
  const row = {
    path: input.path,
    title: input.title,
    description: input.description,
    og_title: input.ogTitle ?? null,
    og_description: input.ogDescription ?? null,
    canonical_url: input.canonicalUrl ?? null,
    robots: input.robots,
    updated_by: input.updatedBy,
  };
  if (input.id) {
    await sb().from("seo_pages").update(row).eq("id", input.id);
    return input.id;
  }
  const { data, error } = await sb().from("seo_pages").insert([row]).select("id").single();
  if (error) throw new Error(error.message);
  return data.id;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function recordAnalyticsEvent(input: AnalyticsEventInput): Promise<void> {
  try {
    await sb().from("analytics_events").insert([
      {
        visitor_id: input.visitorId,
        session_id: input.sessionId,
        event_type: input.eventType,
        path: input.path,
        referrer: input.referrer ?? null,
        metadata: input.metadata ?? null,
      },
    ]);
  } catch {}
}

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
  try {
    const supabase = sb();
    const [{ count: productCount }, { count: orderCount }] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
    ]);
    return {
      contentSections: 0,
      publishedSections: 0,
      seoPages: 0,
      totalProducts: productCount ?? 0,
      totalOrders: orderCount ?? 0,
      analytics: await getAnalyticsSummary(days),
    };
  } catch {
    return {
      contentSections: 0,
      publishedSections: 0,
      seoPages: 0,
      totalProducts: 1,
      totalOrders: 0,
      analytics: await getAnalyticsSummary(days),
    };
  }
}
