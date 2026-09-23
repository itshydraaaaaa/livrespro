import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  analyticsEvents,
  authors,
  categories,
  contentSections,
  InsertAuthor,
  InsertCategory,
  InsertOrder,
  InsertOrderItem,
  InsertProduct,
  InsertUser,
  orderItems,
  orders,
  productAuthors,
  productImages,
  products,
  seoPages,
  users,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function requireDb() {
  const db = await getDb();
  if (!db) {
    throw new Error("La base de données n’est pas disponible. Vérifiez DATABASE_URL.");
  }
  return db;
}

// =============================================================================
// Users & Authentication
// =============================================================================

export async function getUserByEmail(email: string) {
  const db = await requireDb();
  const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
  return rows[0] ?? null;
}

export async function getUserById(id: number) {
  const db = await requireDb();
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  name?: string | null;
  role?: "admin" | "user";
}) {
  const db = await requireDb();
  const result = await db.insert(users).values({
    email: input.email.toLowerCase().trim(),
    passwordHash: input.passwordHash,
    name: input.name ?? null,
    role: input.role ?? "user",
    lastSignedIn: new Date(),
  });
  return Number(result[0].insertId);
}

export async function updateLastSignedIn(userId: number) {
  const db = await requireDb();
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

// =============================================================================
// Categories
// =============================================================================

export async function listCategories() {
  const db = await requireDb();
  return db.select().from(categories).orderBy(categories.sortOrder, categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await requireDb();
  const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function createCategory(input: InsertCategory) {
  const db = await requireDb();
  const result = await db.insert(categories).values(input);
  return Number(result[0].insertId);
}

export async function updateCategory(id: number, input: Partial<InsertCategory>) {
  const db = await requireDb();
  await db.update(categories).set(input).where(eq(categories.id, id));
  return id;
}

// =============================================================================
// Authors
// =============================================================================

export async function listAuthors() {
  const db = await requireDb();
  return db.select().from(authors).orderBy(authors.name);
}

export async function getAuthorBySlug(slug: string) {
  const db = await requireDb();
  const rows = await db.select().from(authors).where(eq(authors.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function createAuthor(input: InsertAuthor) {
  const db = await requireDb();
  const result = await db.insert(authors).values(input);
  return Number(result[0].insertId);
}

export async function updateAuthor(id: number, input: Partial<InsertAuthor>) {
  const db = await requireDb();
  await db.update(authors).set(input).where(eq(authors.id, id));
  return id;
}

// =============================================================================
// Products with Relations (Images, Authors, Category)
// =============================================================================

export type FullProduct = typeof products.$inferSelect & {
  authors: Array<{ id: number; name: string; slug: string; role: string }>;
  images: Array<{ id: number; url: string; alt: string | null; isPrimary: number }>;
  category: typeof categories.$inferSelect | null;
};

export async function listProducts(options?: {
  categoryId?: number;
  categorySlug?: string;
  status?: "published" | "draft" | "archived" | "all";
  limit?: number;
  featuredOnly?: boolean;
}): Promise<FullProduct[]> {
  const db = await requireDb();
  let query = db.select().from(products);

  const conditions = [];

  if (options?.status && options.status !== "all") {
    conditions.push(eq(products.status, options.status));
  } else if (!options?.status) {
    conditions.push(eq(products.status, "published"));
  }

  if (options?.featuredOnly) {
    conditions.push(eq(products.featured, 1));
  }

  if (options?.categoryId) {
    conditions.push(eq(products.categoryId, options.categoryId));
  }

  const productRows = conditions.length > 0
    ? await query.where(and(...conditions)).orderBy(desc(products.featured), desc(products.createdAt))
    : await query.orderBy(desc(products.featured), desc(products.createdAt));

  if (productRows.length === 0) return [];

  const productIds = productRows.map((p) => p.id);

  // Fetch relations in batch
  const [allAuthors, allImages, allCategories] = await Promise.all([
    db
      .select({
        productId: productAuthors.productId,
        authorId: authors.id,
        name: authors.name,
        slug: authors.slug,
        role: productAuthors.role,
      })
      .from(productAuthors)
      .innerJoin(authors, eq(productAuthors.authorId, authors.id))
      .where(inArray(productAuthors.productId, productIds)),
    db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(productImages.sortOrder),
    db.select().from(categories),
  ]);

  const categoryMap = new Map(allCategories.map((c) => [c.id, c]));

  return productRows.map((p) => {
    const pAuthors = allAuthors
      .filter((a) => a.productId === p.id)
      .map((a) => ({ id: a.authorId, name: a.name, slug: a.slug, role: a.role }));

    const pImages = allImages
      .filter((img) => img.productId === p.id)
      .map((img) => ({ id: img.id, url: img.url, alt: img.alt, isPrimary: img.isPrimary }));

    return {
      ...p,
      authors: pAuthors,
      images: pImages,
      category: p.categoryId ? categoryMap.get(p.categoryId) ?? null : null,
    };
  });
}

export async function getProductBySlug(slug: string): Promise<FullProduct | null> {
  const db = await requireDb();
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (rows.length === 0) return null;

  const product = rows[0];

  const [pAuthors, pImages, category] = await Promise.all([
    db
      .select({
        id: authors.id,
        name: authors.name,
        slug: authors.slug,
        role: productAuthors.role,
      })
      .from(productAuthors)
      .innerJoin(authors, eq(productAuthors.authorId, authors.id))
      .where(eq(productAuthors.productId, product.id)),
    db
      .select({
        id: productImages.id,
        url: productImages.url,
        alt: productImages.alt,
        isPrimary: productImages.isPrimary,
      })
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(productImages.sortOrder),
    product.categoryId
      ? db
          .select()
          .from(categories)
          .where(eq(categories.id, product.categoryId))
          .limit(1)
          .then((r) => r[0] ?? null)
      : Promise.resolve(null),
  ]);

  return {
    ...product,
    authors: pAuthors,
    images: pImages,
    category,
  };
}

export async function createProduct(
  productData: InsertProduct,
  authorIds?: number[],
  imageUrls?: Array<{ url: string; alt?: string; isPrimary?: boolean }>
) {
  const db = await requireDb();
  const res = await db.insert(products).values(productData);
  const productId = Number(res[0].insertId);

  if (authorIds && authorIds.length > 0) {
    await db.insert(productAuthors).values(
      authorIds.map((authorId, idx) => ({
        productId,
        authorId,
        sortOrder: idx,
      }))
    );
  }

  if (imageUrls && imageUrls.length > 0) {
    await db.insert(productImages).values(
      imageUrls.map((img, idx) => ({
        productId,
        url: img.url,
        alt: img.alt ?? null,
        isPrimary: img.isPrimary ? 1 : idx === 0 ? 1 : 0,
        sortOrder: idx,
      }))
    );
  }

  return productId;
}

export async function updateProduct(
  id: number,
  productData: Partial<InsertProduct>,
  authorIds?: number[],
  imageUrls?: Array<{ url: string; alt?: string; isPrimary?: boolean }>
) {
  const db = await requireDb();
  await db.update(products).set(productData).where(eq(products.id, id));

  if (authorIds !== undefined) {
    await db.delete(productAuthors).where(eq(productAuthors.productId, id));
    if (authorIds.length > 0) {
      await db.insert(productAuthors).values(
        authorIds.map((authorId, idx) => ({
          productId: id,
          authorId,
          sortOrder: idx,
        }))
      );
    }
  }

  if (imageUrls !== undefined) {
    await db.delete(productImages).where(eq(productImages.productId, id));
    if (imageUrls.length > 0) {
      await db.insert(productImages).values(
        imageUrls.map((img, idx) => ({
          productId: id,
          url: img.url,
          alt: img.alt ?? null,
          isPrimary: img.isPrimary ? 1 : idx === 0 ? 1 : 0,
          sortOrder: idx,
        }))
      );
    }
  }

  return id;
}

// =============================================================================
// Orders & Order Items
// =============================================================================

export type FullOrder = typeof orders.$inferSelect & {
  items: Array<typeof orderItems.$inferSelect>;
};

export async function createMultiItemOrder(input: {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city?: string | null;
  governorate?: string | null;
  postalCode?: string | null;
  orderNotes?: string | null;
  isEducator?: boolean;
  items: Array<{
    productId?: number;
    productSlug: string;
    productTitle: string;
    format?: string;
    unitPrice: string;
    quantity: number;
  }>;
  shippingCost?: string;
}): Promise<{ orderId: number; orderNumber: string }> {
  const db = await requireDb();

  // Generate friendly order number, e.g. LP-2026-9481
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `LP-${new Date().getFullYear()}-${randomSuffix}`;

  // Calculate totals
  let subtotalNum = 0;
  for (const item of input.items) {
    const priceNum = parseFloat(item.unitPrice) || 0;
    subtotalNum += priceNum * item.quantity;
  }

  const shippingNum = parseFloat(input.shippingCost ?? "7.00") || 7.0;
  const totalNum = subtotalNum + shippingNum;

  const orderValues: InsertOrder = {
    orderNumber,
    customerFirstName: input.customerFirstName,
    customerLastName: input.customerLastName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    deliveryAddress: input.deliveryAddress,
    city: input.city ?? null,
    governorate: input.governorate ?? null,
    postalCode: input.postalCode ?? null,
    orderNotes: input.orderNotes ?? null,
    isEducator: input.isEducator ? 1 : 0,
    subtotal: subtotalNum.toFixed(2),
    shippingCost: shippingNum.toFixed(2),
    discountAmount: "0.00",
    totalAmount: totalNum.toFixed(2),
    currency: "TND",
    paymentMethod: "cash_on_delivery",
    paymentStatus: "pending",
    status: "new",
  };

  const orderInsertRes = await db.insert(orders).values(orderValues);
  const orderId = Number(orderInsertRes[0].insertId);

  // Insert order items
  const itemsToInsert: InsertOrderItem[] = input.items.map((item) => {
    const itemPriceNum = parseFloat(item.unitPrice) || 0;
    const itemSubtotal = (itemPriceNum * item.quantity).toFixed(2);
    return {
      orderId,
      productId: item.productId ?? null,
      productSlug: item.productSlug,
      productTitle: item.productTitle,
      format: item.format ?? "Livre physique",
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    };
  });

  await db.insert(orderItems).values(itemsToInsert);

  return { orderId, orderNumber };
}

export async function listOrders(): Promise<FullOrder[]> {
  const db = await requireDb();
  const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  if (orderRows.length === 0) return [];

  const orderIds = orderRows.map((o) => o.id);
  const allItems = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  return orderRows.map((o) => ({
    ...o,
    items: allItems.filter((item) => item.orderId === o.id),
  }));
}

export async function updateOrderStatus(
  orderId: number,
  status: "new" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
) {
  const db = await requireDb();
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}

// =============================================================================
// Editorial Content Sections
// =============================================================================

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

export async function listContentSections(includeDrafts = true) {
  const db = await requireDb();
  const query = db.select().from(contentSections);
  const rows = includeDrafts
    ? await query.orderBy(desc(contentSections.updatedAt))
    : await query
        .where(eq(contentSections.status, "published"))
        .orderBy(desc(contentSections.updatedAt));
  return rows;
}

export async function saveContentSection(input: ContentSectionInput) {
  const db = await requireDb();
  const values = {
    key: input.key,
    eyebrow: input.eyebrow ?? null,
    title: input.title,
    body: input.body ?? null,
    ctaLabel: input.ctaLabel ?? null,
    ctaHref: input.ctaHref ?? null,
    imageUrl: input.imageUrl ?? null,
    status: input.status,
    updatedBy: input.updatedBy,
  } as const;

  if (input.id) {
    await db.update(contentSections).set(values).where(eq(contentSections.id, input.id));
    return input.id;
  }

  const result = await db.insert(contentSections).values(values);
  return Number(result[0].insertId);
}

// =============================================================================
// SEO Pages
// =============================================================================

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

export async function listSeoPages() {
  const db = await requireDb();
  return db.select().from(seoPages).orderBy(seoPages.path);
}

export async function getSeoPage(path: string) {
  const db = await requireDb();
  const result = await db.select().from(seoPages).where(eq(seoPages.path, path)).limit(1);
  return result[0] ?? null;
}

export async function saveSeoPage(input: SeoPageInput) {
  const db = await requireDb();
  const values = {
    path: input.path,
    title: input.title,
    description: input.description,
    ogTitle: input.ogTitle ?? null,
    ogDescription: input.ogDescription ?? null,
    canonicalUrl: input.canonicalUrl ?? null,
    robots: input.robots,
    updatedBy: input.updatedBy,
  } as const;

  if (input.id) {
    await db.update(seoPages).set(values).where(eq(seoPages.id, input.id));
    return input.id;
  }

  const result = await db.insert(seoPages).values(values);
  return Number(result[0].insertId);
}

// =============================================================================
// Consented Behavioral Analytics
// =============================================================================

export type AnalyticsEventInput = {
  visitorId: string;
  sessionId: string;
  eventType: "page_view" | "view_book" | "add_to_cart" | "initiate_checkout";
  path: string;
  referrer?: string | null;
  metadata?: { productHandle?: string } | null;
};

export async function recordAnalyticsEvent(input: AnalyticsEventInput) {
  const db = await requireDb();
  await db.insert(analyticsEvents).values({
    visitorId: input.visitorId,
    sessionId: input.sessionId,
    eventType: input.eventType,
    path: input.path,
    referrer: input.referrer ?? null,
    metadata: input.metadata ?? null,
  });
}

export async function getAnalyticsSummary(days: number) {
  const db = await requireDb();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [eventsRow, visitorsRow, pagesRow, booksRow, cartsRow, topPages, eventMix] =
    await Promise.all([
      db.select({ total: sql<number>`count(*)` }).from(analyticsEvents).where(gte(analyticsEvents.createdAt, since)),
      db.select({ total: sql<number>`count(distinct ${analyticsEvents.visitorId})` }).from(analyticsEvents).where(gte(analyticsEvents.createdAt, since)),
      db.select({ total: sql<number>`count(*)` }).from(analyticsEvents).where(and(gte(analyticsEvents.createdAt, since), eq(analyticsEvents.eventType, "page_view"))),
      db.select({ total: sql<number>`count(*)` }).from(analyticsEvents).where(and(gte(analyticsEvents.createdAt, since), eq(analyticsEvents.eventType, "view_book"))),
      db.select({ total: sql<number>`count(*)` }).from(analyticsEvents).where(and(gte(analyticsEvents.createdAt, since), eq(analyticsEvents.eventType, "add_to_cart"))),
      db.select({ path: analyticsEvents.path, total: sql<number>`count(*)` })
        .from(analyticsEvents)
        .where(and(gte(analyticsEvents.createdAt, since), eq(analyticsEvents.eventType, "page_view")))
        .groupBy(analyticsEvents.path)
        .orderBy(desc(sql`count(*)`))
        .limit(6),
      db.select({ eventType: analyticsEvents.eventType, total: sql<number>`count(*)` })
        .from(analyticsEvents)
        .where(gte(analyticsEvents.createdAt, since))
        .groupBy(analyticsEvents.eventType)
        .orderBy(desc(sql`count(*)`)),
    ]);

  const pageViews = Number(pagesRow[0]?.total ?? 0);
  const bookViews = Number(booksRow[0]?.total ?? 0);
  const cartAdds = Number(cartsRow[0]?.total ?? 0);

  return {
    days,
    totalEvents: Number(eventsRow[0]?.total ?? 0),
    uniqueVisitors: Number(visitorsRow[0]?.total ?? 0),
    pageViews,
    bookViews,
    cartAdds,
    cartRate: bookViews > 0 ? Math.round((cartAdds / bookViews) * 1000) / 10 : 0,
    topPages: topPages.map((row) => ({ path: row.path, total: Number(row.total) })),
    eventMix: eventMix.map((row) => ({ eventType: row.eventType, total: Number(row.total) })),
  };
}

export async function getAdminOverview(days: number) {
  const db = await requireDb();
  const [contentRow, publishedRow, seoRow, productRow, orderRow, analytics] =
    await Promise.all([
      db.select({ total: sql<number>`count(*)` }).from(contentSections),
      db.select({ total: sql<number>`count(*)` }).from(contentSections).where(eq(contentSections.status, "published")),
      db.select({ total: sql<number>`count(*)` }).from(seoPages),
      db.select({ total: sql<number>`count(*)` }).from(products),
      db.select({ total: sql<number>`count(*)` }).from(orders),
      getAnalyticsSummary(days),
    ]);

  return {
    contentSections: Number(contentRow[0]?.total ?? 0),
    publishedSections: Number(publishedRow[0]?.total ?? 0),
    seoPages: Number(seoRow[0]?.total ?? 0),
    totalProducts: Number(productRow[0]?.total ?? 0),
    totalOrders: Number(orderRow[0]?.total ?? 0),
    analytics,
  };
}
