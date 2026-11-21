import "dotenv/config";
import fs from "fs";
import path from "path";
import { getSupabaseAdmin } from "./services/supabase";

interface BookData {
  id_jalyss: string;
  title: string;
  slug: string;
  sku: string;
  isbn?: string;
  shortDescription: string;
  description: string;
  descriptionHtml: string;
  price: string;
  compareAtPrice: string;
  currency: string;
  publisher: string;
  coverImage: string;
  remoteImage?: string;
  backImage?: string;
  categorySlug: string;
  authors: string[];
  authorBios?: Record<string, string>;
  language: string;
  format: string;
  productType: string;
  featured?: number;
}

const CATEGORIES_CONFIG = [
  {
    name: "Marketing & Vente",
    slug: "marketing-vente",
    description: "Stratégies marketing, vente, persuasion, acquisition client et branding.",
    sortOrder: 1,
  },
  {
    name: "Entrepreneuriat & Startups",
    slug: "entrepreneuriat",
    description: "Création d'entreprise, lean startup, modèles d'affaires et passage à l'échelle.",
    sortOrder: 2,
  },
  {
    name: "Management & Leadership",
    slug: "management-strategie",
    description: "Gouvernance, gestion d'équipes, culture d'entreprise et leadership.",
    sortOrder: 3,
  },
  {
    name: "Finance & Investissement",
    slug: "finance-investissement",
    description: "Gestion financière, création de richesse, investissement et psychologie de l'argent.",
    sortOrder: 4,
  },
  {
    name: "Design, UX & Innovation",
    slug: "design-produit",
    description: "Design thinking, expérience utilisateur, conception de produit et storytelling.",
    sortOrder: 5,
  },
  {
    name: "Développement Personnel & Efficacité",
    slug: "developpement-personnel",
    description: "Productivité, fixation d'objectifs, discipline et réussite professionnelle.",
    sortOrder: 6,
  },
];

function slugifyAuthor(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || `author-${Date.now()}`;
}

export async function runCatalogSeed() {
  console.log("🚀 Starting LivresPro Catalog Seeding...");
  const sb = getSupabaseAdmin();
  if (!sb) {
    throw new Error("Supabase is not configured!");
  }

  // 1. Categories
  console.log("📁 Seeding / Updating Categories...");
  const { data: existingCats, error: catFetchErr } = await sb.from("categories").select("*");
  if (catFetchErr) throw catFetchErr;

  const catMap = new Map<string, number>();
  for (const c of existingCats || []) {
    catMap.set(c.slug, c.id);
  }

  for (const cat of CATEGORIES_CONFIG) {
    if (catMap.has(cat.slug)) {
      const existingId = catMap.get(cat.slug)!;
      await sb
        .from("categories")
        .update({
          name: cat.name,
          description: cat.description,
          sort_order: cat.sortOrder,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingId);
      console.log(`  Updated category: ${cat.name} (ID: ${existingId})`);
    } else {
      const { data, error } = await sb
        .from("categories")
        .insert([
          {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            sort_order: cat.sortOrder,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select("id")
        .single();
      if (error) {
        console.error(`  Error creating category ${cat.name}:`, error.message);
      } else {
        catMap.set(cat.slug, data.id);
        console.log(`  Created category: ${cat.name} (ID: ${data.id})`);
      }
    }
  }

  // 2. Load Books Data
  const jsonPath = path.resolve(process.cwd(), "scripts/books_data.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`books_data.json not found at ${jsonPath}`);
  }
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const books: BookData[] = JSON.parse(rawData);
  console.log(`📚 Loaded ${books.length} books from books_data.json`);

  // 3. Authors Cache
  console.log("✍️ Processing Authors...");
  const { data: existingAuthors, error: authFetchErr } = await sb.from("authors").select("*");
  if (authFetchErr) throw authFetchErr;

  const authorMap = new Map<string, number>();
  for (const a of existingAuthors || []) {
    authorMap.set(a.name, a.id);
    authorMap.set(a.slug, a.id);
  }

  // Collect all unique authors
  const allAuthors = new Map<string, { name: string; bio?: string }>();
  for (const b of books) {
    for (const a of b.authors) {
      const clean = a.trim();
      if (clean && !allAuthors.has(clean)) {
        allAuthors.set(clean, {
          name: clean,
          bio: b.authorBios?.[clean] || undefined,
        });
      }
    }
  }

  for (const [authorName, info] of Array.from(allAuthors.entries())) {
    if (authorMap.has(authorName)) continue;

    const slug = slugifyAuthor(authorName);
    const { data, error } = await sb
      .from("authors")
      .insert([
        {
          name: authorName,
          slug,
          biography: info.bio || `Auteur et spécialiste reconnu : ${authorName}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.warn(`  Warning adding author ${authorName}:`, error.message);
      // Try fetching existing by slug
      const { data: existing } = await sb.from("authors").select("id").eq("slug", slug).maybeSingle();
      if (existing) {
        authorMap.set(authorName, existing.id);
        authorMap.set(slug, existing.id);
      }
    } else {
      authorMap.set(authorName, data.id);
      authorMap.set(slug, data.id);
      console.log(`  Created author: ${authorName} (ID: ${data.id})`);
    }
  }

  // 4. Products Upsert
  console.log("📖 Inserting / Updating Products...");
  const { data: existingProducts, error: prodFetchErr } = await sb.from("products").select("id, slug");
  if (prodFetchErr) throw prodFetchErr;

  const productMap = new Map<string, number>();
  for (const p of existingProducts || []) {
    productMap.set(p.slug, p.id);
  }

  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const categoryId = catMap.get(b.categorySlug) || catMap.get("management-strategie") || null;

    const payload: any = {
      title: b.title,
      slug: b.slug,
      sku: b.sku,
      isbn: b.isbn || null,
      short_description: b.shortDescription,
      description: b.description,
      description_html: b.descriptionHtml,
      product_type: b.productType || "Livre business",
      format: b.format || "PHYSICAL_BOOK",
      price: b.price,
      compare_at_price: b.compareAtPrice || null,
      currency: b.currency || "TND",
      stock_quantity: 50,
      availability_status: "in_stock",
      publisher: b.publisher || "LivresPro",
      language: b.language || "العربية",
      cover_image: b.coverImage,
      category_id: categoryId,
      featured: b.featured ?? 0,
      status: "published",
      seo_title: `${b.title} | LivresPro.tn`,
      seo_description: b.shortDescription.slice(0, 160),
      metadata: {
        id_jalyss: b.id_jalyss,
        remoteImage: b.remoteImage || null,
      },
      updated_at: new Date().toISOString(),
    };

    let productId: number;

    if (productMap.has(b.slug)) {
      productId = productMap.get(b.slug)!;
      const { error: updErr } = await sb.from("products").update(payload).eq("id", productId);
      if (updErr) {
        console.error(`  Error updating product ${b.title}:`, updErr.message);
        continue;
      }
      updatedCount++;
    } else {
      payload.created_at = new Date().toISOString();
      const { data, error: insErr } = await sb.from("products").insert([payload]).select("id").single();
      if (insErr) {
        console.error(`  Error inserting product ${b.title}:`, insErr.message);
        continue;
      }
      productId = data.id;
      productMap.set(b.slug, productId);
      insertedCount++;
    }

    // Link authors
    if (b.authors.length > 0) {
      await sb.from("product_authors").delete().eq("product_id", productId);
      const authorRows = b.authors
        .map((a, sortOrder) => {
          const authorId = authorMap.get(a.trim());
          if (!authorId) return null;
          return {
            product_id: productId,
            author_id: authorId,
            role: "Auteur",
            sort_order: sortOrder + 1,
          };
        })
        .filter((r): r is { product_id: number; author_id: number; role: string; sort_order: number } => Boolean(r));

      if (authorRows.length > 0) {
        await sb.from("product_authors").insert(authorRows);
      }
    }

    // Link images
    await sb.from("product_images").delete().eq("product_id", productId);
    const imageRows = [
      {
        product_id: productId,
        url: b.coverImage,
        alt: `Couverture de ${b.title}`,
        sort_order: 1,
        is_primary: 1,
      },
    ];
    if (b.backImage) {
      imageRows.push({
        product_id: productId,
        url: b.backImage,
        alt: `Quatrième de couverture de ${b.title}`,
        sort_order: 2,
        is_primary: 0,
      });
    } else if (b.remoteImage && b.remoteImage !== b.coverImage) {
      imageRows.push({
        product_id: productId,
        url: b.remoteImage,
        alt: `Couverture haute résolution de ${b.title}`,
        sort_order: 2,
        is_primary: 0,
      });
    }
    await sb.from("product_images").insert(imageRows);

    if ((i + 1) % 25 === 0 || i === books.length - 1) {
      console.log(`  Processed ${i + 1}/${books.length} products...`);
    }
  }

  console.log(`✅ Catalog Seeding Finished! Inserted: ${insertedCount}, Updated: ${updatedCount}, Total Books: ${books.length}`);
}

// Direct execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("seed-catalog.ts")) {
  runCatalogSeed()
    .then(() => {
      console.log("🎉 All books successfully synced to Supabase database!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}
