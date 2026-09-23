import type { Collection, Product } from "@shared/commerce/types";
import * as db from "../db";

const FALLBACK_B2B_PRODUCT: Product = {
  id: "1",
  handle: "b2b-brand-management-tunisia",
  title: "B2B Brand Management — Édition Tunisie",
  description:
    "L'ouvrage de référence internationale de Philip Kotler & Waldemar Pfoertsch, adapté au contexte économique et managérial tunisien par Walid Kallel. Inclus 7 cas réels d'entreprises tunisiennes (BIAT, Wallyscar, MSB, ARVEA, Gourmandise, MPBS, CHO Group).",
  descriptionHtml:
    "<p>L'ouvrage de référence internationale de <strong>Philip Kotler & Waldemar Pfoertsch</strong>, adapté au contexte économique et managérial tunisien par <strong>Walid Kallel</strong>.</p><p>Comprend 7 études de cas approfondies d'entreprises tunisiennes leaders dans leur secteur.</p>",
  productType: "Livre relié",
  vendor: "Philip Kotler · Waldemar Pfoertsch · Walid Kallel",
  tags: ["B2B", "Stratégie", "Marketing B2B", "Cas Tunisiens", "Livre physique"],
  images: [
    {
      url: "/business-success-logo.png",
      altText: "B2B Brand Management — Tunisia Edition",
    },
  ],
  priceRange: {
    min: { amount: "65.00", currencyCode: "TND" },
    max: { amount: "65.00", currencyCode: "TND" },
  },
  options: [{ name: "Format", values: ["Livre relié"] }],
  variants: [
    {
      id: "var-1",
      title: "Livre relié",
      price: { amount: "65.00", currencyCode: "TND" },
      compareAtPrice: { amount: "85.00", currencyCode: "TND" },
      availableForSale: true,
      selectedOptions: [{ name: "Format", value: "Livre relié" }],
    },
  ],
};

const FALLBACK_COLLECTIONS: Collection[] = [
  {
    id: "1",
    handle: "strategie-b2b",
    title: "Stratégie & B2B",
    description: "Ouvrages de référence en stratégie industrielle et marketing B2B.",
    image: null,
  },
  {
    id: "2",
    handle: "marketing-vente",
    title: "Marketing & Vente",
    description: "Méthodes de croissance, distribution et performance commerciale.",
    image: null,
  },
  {
    id: "3",
    handle: "entrepreneuriat",
    title: "Entrepreneuriat & Leadership",
    description: "Guides pratiques pour fondateurs, dirigeants et managers.",
    image: null,
  },
];

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
  try {
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

    if (rawProducts.length === 0) {
      return [FALLBACK_B2B_PRODUCT];
    }

    return rawProducts.map(normalizeDbProduct);
  } catch {
    // If DB is offline or initializing, return flagship book
    return [FALLBACK_B2B_PRODUCT];
  }
}

export async function getStorefrontProductByHandle(handle: string): Promise<Product | null> {
  try {
    const p = await db.getProductBySlug(handle);
    if (!p || p.status !== "published") {
      if (handle === FALLBACK_B2B_PRODUCT.handle) return FALLBACK_B2B_PRODUCT;
      return null;
    }
    return normalizeDbProduct(p);
  } catch {
    if (handle === FALLBACK_B2B_PRODUCT.handle) return FALLBACK_B2B_PRODUCT;
    return null;
  }
}

export async function listStorefrontCollections(): Promise<Collection[]> {
  try {
    const cats = await db.listCategories();
    if (cats.length === 0) return FALLBACK_COLLECTIONS;
    return cats.map((c) => ({
      id: String(c.id),
      handle: c.slug,
      title: c.name,
      description: c.description || "",
      image: c.image ? { url: c.image, altText: c.name } : null,
    }));
  } catch {
    return FALLBACK_COLLECTIONS;
  }
}

export async function getStorefrontCollectionByHandle(handle: string): Promise<Collection | null> {
  try {
    const c = await db.getCategoryBySlug(handle);
    if (!c) {
      return FALLBACK_COLLECTIONS.find((col) => col.handle === handle) ?? null;
    }
    return {
      id: String(c.id),
      handle: c.slug,
      title: c.name,
      description: c.description || "",
      image: c.image ? { url: c.image, altText: c.name } : null,
    };
  } catch {
    return FALLBACK_COLLECTIONS.find((col) => col.handle === handle) ?? null;
  }
}
