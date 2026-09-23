import "dotenv/config";
import { hashPassword } from "./_core/auth";
import {
  createAuthor,
  createCategory,
  createProduct,
  createUser,
  getUserByEmail,
  listAuthors,
  listCategories,
  listProducts,
} from "./db";

export async function runSeed() {
  console.log("🌱 Starting LivresPro.tn Database Seeding...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@livrespro.tn";
  const adminPass = process.env.ADMIN_INITIAL_PASSWORD || "AdminLivresPro2026!";
  const existingAdmin = await getUserByEmail(adminEmail);

  if (!existingAdmin) {
    const adminId = await createUser({
      email: adminEmail,
      passwordHash: hashPassword(adminPass),
      name: "Administrateur LivresPro",
      role: "admin",
    });
    console.log(`✅ Admin user seeded: ${adminEmail} (ID: ${adminId})`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
  }

  // 2. Seed Categories
  const defaultCategories = [
    {
      name: "Marketing & Marque",
      slug: "marketing-marque",
      description: "Construire des marques B2B solides, attractives et créatrices de préférence.",
      sortOrder: 1,
    },
    {
      name: "Management & Leadership",
      slug: "management-leadership",
      description: "Méthodes de gouvernance, culture d'entreprise et leadership d'équipes performantes.",
      sortOrder: 2,
    },
    {
      name: "Stratégie & Innovation",
      slug: "strategie-innovation",
      description: "Modèles d'affaires, transformation digitale et planification stratégique.",
      sortOrder: 3,
    },
    {
      name: "Entrepreneuriat & Croissance",
      slug: "entrepreneuriat-croissance",
      description: "Fondations pour créer, développer et scaler une entreprise durable.",
      sortOrder: 4,
    },
  ];

  const existingCats = await listCategories();
  const catMap = new Map(existingCats.map((c) => [c.slug, c.id]));

  for (const cat of defaultCategories) {
    if (!catMap.has(cat.slug)) {
      const id = await createCategory(cat);
      catMap.set(cat.slug, id);
      console.log(`✅ Category seeded: ${cat.name}`);
    }
  }

  // 3. Seed Authors
  const defaultAuthors = [
    {
      name: "Philip Kotler",
      slug: "philip-kotler",
      biography:
        "Professeur émérite en marketing international à la Kellogg School of Management de la Northwestern University. Reconnu mondialement comme le père fondateur du marketing moderne.",
    },
    {
      name: "Waldemar Pfoertsch",
      slug: "waldemar-pfoertsch",
      biography:
        "Professeur de marketing B2B international, auteur de référence mondial sur le branding industriel et la gestion stratégique de marques inter-entreprises.",
    },
    {
      name: "Walid Kallel",
      slug: "walid-kallel",
      biography:
        "Docteur en sciences de gestion, enseignant-chercheur et consultant de premier plan en stratégie et branding B2B auprès des entreprises tunisiennes et régionales.",
    },
  ];

  const existingAuthors = await listAuthors();
  const authorMap = new Map(existingAuthors.map((a) => [a.slug, a.id]));

  for (const author of defaultAuthors) {
    if (!authorMap.has(author.slug)) {
      const id = await createAuthor(author);
      authorMap.set(author.slug, id);
      console.log(`✅ Author seeded: ${author.name}`);
    }
  }

  // 4. Seed Products
  const existingProducts = await listProducts({ status: "all" });
  const productSlugs = new Set(existingProducts.map((p) => p.slug));

  // Product #1: Flagship B2B Brand Management — Tunisia Edition
  if (!productSlugs.has("b2b-brand-management")) {
    const kotlerId = authorMap.get("philip-kotler")!;
    const pfoertschId = authorMap.get("waldemar-pfoertsch")!;
    const kallelId = authorMap.get("walid-kallel")!;
    const marketingCatId = catMap.get("marketing-marque")!;

    await createProduct(
      {
        title: "B2B Brand Management — Tunisia Edition",
        slug: "b2b-brand-management",
        sku: "LP-B2B-TN-01",
        isbn: "978-9973-0-0000-0",
        publisher: "L’Atelier des Pages / Business Success",
        publicationDate: "2026",
        language: "Français",
        pageCount: 384,
        shortDescription:
          "Une édition tunisienne reliant les fondamentaux internationaux du B2B Brand Management à des études de cas et à la réalité des organisations tunisiennes.",
        description: `B2B Brand Management — Tunisia Edition relie les principes fondamentaux du marketing et de la marque inter-entreprises aux réalités du terrain tunisien.
          
À travers des analyses rigoureuses et des études de cas concrètes (BIAT, Wallyscar, MSB, ARVEA Nature, Gourmandise, MPBS, CHO Group), cet ouvrage donne aux dirigeants, directeurs marketing et universitaires les outils indispensables pour créer de la préférence et faire de la marque un actif de valeur stratégique.`,
        descriptionHtml: `<p><strong>B2B Brand Management — Tunisia Edition</strong> relie les principes fondamentaux du marketing et de la marque inter-entreprises aux réalités du terrain tunisien.</p>
<p>À travers des analyses rigoureuses et des études de cas concrètes (<strong>BIAT, Wallyscar, MSB, ARVEA Nature, Gourmandise, MPBS, CHO Group</strong>), cet ouvrage donne aux dirigeants, directeurs marketing et universitaires les outils indispensables pour créer de la préférence et faire de la marque un actif de valeur stratégique.</p>`,
        productType: "Livre business",
        format: "PHYSICAL_BOOK",
        price: "65.00",
        compareAtPrice: "75.00",
        currency: "TND",
        stockQuantity: 500,
        availabilityStatus: "in_stock",
        coverImage: "/editorial/b2b-launch/book-angle.jpg",
        categoryId: marketingCatId,
        featured: 1,
        status: "published",
        seoTitle: "B2B Brand Management — Tunisia Edition | Philip Kotler & Walid Kallel",
        seoDescription:
          "Commandez le livre B2B Brand Management - Édition Tunisienne. Paiement à la livraison partout en Tunisie.",
        metadata: {
          caseStudies: [
            "BIAT",
            "Wallyscar",
            "MSB",
            "ARVEA Nature",
            "Gourmandise",
            "MPBS",
            "CHO Group",
          ],
        },
      },
      [kotlerId, pfoertschId, kallelId],
      [
        { url: "/editorial/b2b-launch/book-angle.jpg", alt: "B2B Brand Management Angle", isPrimary: true },
        { url: "/editorial/b2b-launch/book-front.jpg", alt: "B2B Brand Management Couverture" },
        { url: "/editorial/b2b-launch/book-back.jpg", alt: "B2B Brand Management Dos" },
        { url: "/editorial/b2b-launch/media.jpg", alt: "B2B Brand Management Lancement" },
      ]
    );
    console.log("✅ Product #1 Seeded: B2B Brand Management — Tunisia Edition");
  }

  // Product #2 (Test / Scalability): Stratégies de Croissance B2B
  if (!productSlugs.has("strategies-croissance-b2b")) {
    const kallelId = authorMap.get("walid-kallel")!;
    const stratCatId = catMap.get("strategie-innovation")!;

    await createProduct(
      {
        title: "Stratégies de Croissance B2B en Afrique du Nord",
        slug: "strategies-croissance-b2b",
        sku: "LP-STRAT-02",
        isbn: "978-9973-0-0002-4",
        publisher: "L’Atelier des Pages",
        publicationDate: "2025",
        language: "Français",
        pageCount: 260,
        shortDescription: "Cadres stratégiques et leviers de pénétration pour les marchés émergents du Maghreb.",
        description: "Ce livre présente les dynamiques de négociation, d'alliances stratégiques et d'expansion inter-entreprises en Afrique du Nord.",
        productType: "Livre stratégique",
        format: "PHYSICAL_BOOK",
        price: "48.00",
        currency: "TND",
        stockQuantity: 150,
        availabilityStatus: "in_stock",
        coverImage: "/editorial/b2b-launch/book-front.jpg",
        categoryId: stratCatId,
        featured: 0,
        status: "published",
      },
      [kallelId],
      [{ url: "/editorial/b2b-launch/book-front.jpg", isPrimary: true }]
    );
    console.log("✅ Product #2 Seeded: Stratégies de Croissance B2B");
  }

  // Product #3 (Test / Scalability): Le Guide Pratique du Dirigeant PME
  if (!productSlugs.has("guide-pratique-dirigeant-pme")) {
    const mgmtCatId = catMap.get("management-leadership")!;

    await createProduct(
      {
        title: "Le Guide Pratique du Dirigeant PME",
        slug: "guide-pratique-dirigeant-pme",
        sku: "LP-MGMT-03",
        isbn: "978-9973-0-0003-1",
        publisher: "L’Atelier des Pages",
        publicationDate: "2025",
        language: "Français",
        pageCount: 220,
        shortDescription: "Gouvernance, trésorerie et pilotage d'équipes pour dirigeants d'entreprises tunisiennes.",
        description: "Un manuel opérationnel pour structurer les fonctions clés d'une PME en phase d'accélération commerciale.",
        productType: "Guide méthodologique",
        format: "PHYSICAL_BOOK",
        price: "35.00",
        currency: "TND",
        stockQuantity: 200,
        availabilityStatus: "in_stock",
        coverImage: "/editorial/b2b-launch/book-back.jpg",
        categoryId: mgmtCatId,
        featured: 0,
        status: "published",
      },
      [],
      [{ url: "/editorial/b2b-launch/book-back.jpg", isPrimary: true }]
    );
    console.log("✅ Product #3 Seeded: Le Guide Pratique du Dirigeant PME");
  }

  console.log("🎉 Seeding completed successfully!");
}

// Allow direct execution via tsx
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("seed.ts")) {
  runSeed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
}
