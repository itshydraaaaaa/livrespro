import type { Collection, Product } from "@shared/commerce/types";
import * as db from "../db";

/**
 * Normalizes a database product with relations into the frontend-facing Product interface.
 */
function normalizeDbProduct(p: db.FullProduct): Product {
  const authorNames = p.authors.map((a) => a.name).join(" · ");
  const vendor = authorNames || p.publisher || "L’Atelier des Pages";

  const tags: string[] = [];
  if (p.category?.name) tags.push(p.category.name);
  if (p.productType) tags.push(p.productType);
  if (p.format === "PHYSICAL_BOOK") tags.push("Livre physique");
  else if (p.format === "DIGITAL_BOOK") tags.push("Guide numérique");

  // Build images array
  const images = [];
  if (p.coverImage) {
    images.push({
      url: p.coverImage,
      altText: p.title,
    });
  }
  for (const img of p.images) {
    if (img.url !== p.coverImage) {
      images.push({
        url: img.url,
        altText: img.alt || p.title,
      });
    }
  }

  const priceMoney = {
    amount: p.price,
    currencyCode: p.currency || "TND",
  };

  const compareAtPriceMoney = p.compareAtPrice
    ? { amount: p.compareAtPrice, currencyCode: p.currency || "TND" }
    : null;

  return {
    id: String(p.id),
    handle: p.slug,
    title: p.title,
    description: p.description,
    descriptionHtml: p.descriptionHtml || `<p>${p.description}</p>`,
    productType: p.productType,
    vendor,
    tags,
    images,
    priceRange: {
      min: priceMoney,
      max: priceMoney,
    },
    options: [
      {
        name: "Format",
        values: [p.format === "PHYSICAL_BOOK" ? "Livre relié" : "Édition numérique"],
      },
    ],
    variants: [
      {
        id: `var-${p.id}`,
        title: p.format === "PHYSICAL_BOOK" ? "Livre relié" : "Édition numérique",
        price: priceMoney,
        compareAtPrice: compareAtPriceMoney,
        availableForSale: p.availabilityStatus === "in_stock",
        selectedOptions: [
          {
            name: "Format",
            value: p.format === "PHYSICAL_BOOK" ? "Livre relié" : "Édition numérique",
          },
        ],
      },
    ],
  };
}

export async function listStorefrontProducts(options?: {
  first?: number;
  collectionHandle?: string;
}): Promise<Product[]> {
  let categoryId: number | undefined;

  if (options?.collectionHandle) {
    const cat = await db.getCategoryBySlug(options.collectionHandle);
    if (cat) categoryId = cat.id;
  }

  const rawProducts = await db.listProducts({
    categoryId,
    status: "published",
    limit: options?.first ?? 50,
  });

  return rawProducts.map(normalizeDbProduct);
}

export async function getStorefrontProductByHandle(handle: string): Promise<Product | null> {
  const p = await db.getProductBySlug(handle);
  if (!p || p.status !== "published") return null;
  return normalizeDbProduct(p);
}

export async function listStorefrontCollections(): Promise<Collection[]> {
  const cats = await db.listCategories();
  return cats.map((c) => ({
    id: String(c.id),
    handle: c.slug,
    title: c.name,
    description: c.description || "",
    image: c.image ? { url: c.image, altText: c.name } : null,
  }));
}

export async function getStorefrontCollectionByHandle(handle: string): Promise<Collection | null> {
  const c = await db.getCategoryBySlug(handle);
  if (!c) return null;
  return {
    id: String(c.id),
    handle: c.slug,
    title: c.name,
    description: c.description || "",
    image: c.image ? { url: c.image, altText: c.name } : null,
  };
}
