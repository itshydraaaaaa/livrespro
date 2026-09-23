# LivresPro.tn — System Architecture Specification

## 1. High-Level Architecture Overview

LivresPro.tn is a full-stack, scalable online bookstore and digital commerce platform tailored for the Tunisian business and academic market.

```
                                CLIENT LAYER (React 19)
    ┌────────────────────────────────────────────────────────────────────────┐
    │  - Wouter Router (/librairie, /livres/:handle, /admin/*, /login)       │
    │  - Native Cart Context (LocalStorage + Multi-item state in TND)        │
    │  - CheckoutModal (Direct Cash-on-Delivery with Tunisian governorates)  │
    │  - TanStack React Query v5 + @trpc/client                              │
    └───────────────────────────────────┬────────────────────────────────────┘
                                        │
                                        │ tRPC over HTTP / JSON
                                        ▼
                                SERVER LAYER (Express 4)
    ┌────────────────────────────────────────────────────────────────────────┐
    │  - server/_core/index.ts (Express app + Static Vite handler)           │
    │  - server/_core/auth.ts (Node native scrypt hashing + Jose JWT)        │
    │  - server/services/bookstoreService.ts (Catalog & cart normalizer)     │
    │  - server/routers/ (commerce, site, admin, auth, system)               │
    └───────────────────────────────────┬────────────────────────────────────┘
                                        │
                                        │ Drizzle ORM (MySQL2 Pool)
                                        ▼
                                DATABASE LAYER (MySQL 8)
    ┌────────────────────────────────────────────────────────────────────────┐
    │  - products, categories, authors, product_authors, product_images      │
    │  - orders, order_items                                                 │
    │  - users (admin / user roles)                                          │
    │  - content_sections, seo_pages, analytics_events                       │
    └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Key Architectural Decisions

### 2.1 Complete Decoupling from Shopify
* **Previous State**: Relied on external Shopify Storefront GraphQL API which was unconfigured and unsuited for Tunisian Dinar (TND) Cash-on-Delivery.
* **New State**: 100% self-contained database bookstore. The `commerce` and `site` routers directly query MySQL via Drizzle ORM, returning backend-agnostic TypeScript shapes (`Product`, `Collection`, `CartItem`, `Cart`).

### 2.2 Complete Decoupling from Proprietary Manus Infrastructure
* **Previous State**: Admin authentication depended on Manus internal OAuth endpoints (`WebDevAuthPublicService`) and assets proxied through Forge API (`/manus-storage/*`).
* **New State**:
  * Native Email + Password authentication using Node.js built-in `crypto.scrypt` with cryptographic salt and timing-safe comparisons.
  * Signed JWT session cookies issued via `jose` with `HttpOnly`, `SameSite`, and `Secure` attributes.
  * Static media stored locally in `client/public/editorial/`.

### 2.3 True Multi-Product Catalog & Orders
* **Previous State**: Hardcoded Zod literal checking `productHandle: "b2b-brand-management"` and a flat `orders` table without line items.
* **New State**:
  * Relational tables: `products`, `categories`, `authors`, `product_authors`, `product_images`.
  * Multi-item order architecture: `orders` and `order_items` capturing historical price snapshots, quantities, and item titles.
  * Storefront supports multi-product browsing, category filtering, search, multi-item cart drawer, and single-click COD checkout.
  * *B2B Brand Management — Tunisia Edition* is seeded as Product #1, ready to coexist with dozens or hundreds of future titles.

---

## 3. Directory Layout

```
livrespro/
├── client/
│   ├── public/                 # Static media and local book photography
│   └── src/
│       ├── components/
│       │   ├── storefront/     # SiteHeader, SiteFooter, CartDrawer, CheckoutModal, ProductCard
│       │   └── ui/             # Radix / Tailwind UI primitives
│       ├── contexts/           # CartContext (multi-product state), ThemeContext
│       ├── pages/              # Home, Shop, ProductDetail, B2BBook, Educators, Login, Admin
│       ├── App.tsx             # Wouter router definitions
│       └── lib/                # tRPC client, formatters, utilities
├── server/
│   ├── _core/                  # Core auth, trpc context, cookies, system router
│   ├── routers/                # admin.ts, commerce.ts, site.ts
│   ├── services/               # bookstoreService.ts
│   ├── db.ts                   # Drizzle ORM queries
│   ├── routers.ts              # Root tRPC appRouter
│   └── seed.ts                 # Database seeding script
├── shared/
│   ├── commerce/types.ts       # Backend-agnostic commerce models (Product, Cart, Money)
│   └── const.ts                # Session cookie constants
└── drizzle/
    ├── schema.ts               # Complete relational MySQL schema
    └── migrations/             # Versioned SQL migration files
```
