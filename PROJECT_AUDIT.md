# LivresPro.tn — Comprehensive Project Audit (Phase 1)

**Date**: September 2026  
**Auditor**: Senior Full-Stack Architect & Production Engineering Lead  
**Scope**: Full repository analysis of LivresPro.tn (`c:\Users\MSI\Downloads\livrespro\`)  
**Objective**: Establish complete factual baseline of the codebase, pinpoint technical debt, catalog hardcoded assumptions, identify proprietary and external dependencies, and specify the transformation roadmap into a scalable multi-product Tunisian bookstore.

---

## 1. Repository Inventory & File Structure

The project currently contains a React 19 + Express 4 + tRPC 11 application with two workspace snapshots: the root working tree and a parallel directory `booksite_work/` (historical development workspace containing `node_modules` cache and patches).

```
livrespro/
├── client/                     # Frontend Single Page Application
│   ├── public/                 # Static assets (logos, editorial photos)
│   │   ├── business-success-logo.png
│   │   └── editorial/
│   │       ├── b2b-launch/     # High-resolution book launch photos
│   │       └── case-study-logos/ # 7 Tunisian enterprise logos
│   ├── src/
│   │   ├── _core/hooks/        # Proprietary Manus useAuth hook
│   │   ├── components/         # Radix / Shadcn UI + Storefront components
│   │   ├── contexts/           # CartContext (Shopify-coupled), ThemeContext
│   │   ├── lib/                # tRPC client, formatters, cart helpers
│   │   ├── pages/              # Home, Shop, ProductDetail, B2BBook, Educators, Admin
│   │   ├── App.tsx             # Wouter routing configuration
│   │   ├── const.ts            # Client OAuth portal redirection
│   │   └── main.tsx            # Entry point with React Query & tRPC provider
├── server/                     # Backend API & Application Server
│   ├── _core/                  # Core infrastructure
│   │   ├── index.ts            # Express server bootstrap with Vite/static handling
│   │   ├── oauth.ts            # Proprietary Manus OAuth callback route
│   │   ├── sdk.ts              # Proprietary Manus WebDev SDK & token exchanger
│   │   ├── storageProxy.ts     # Proprietary Forge /manus-storage proxy
│   │   ├── shopify.ts          # Shopify GraphQL Storefront API adapter
│   │   ├── shopifyNormalize.ts # Shopify GraphQL response mappers
│   │   ├── trpc.ts             # tRPC procedure builders (public, protected, admin)
│   │   └── env.ts              # Environment variable loader
│   ├── routers/
│   │   ├── admin.ts            # Admin CMS, SEO, orders, and audience endpoints
│   │   ├── commerce.ts         # tRPC proxy routing to shopify.ts
│   │   └── site.ts             # Direct COD order, analytics, and public SEO
│   ├── db.ts                   # Drizzle ORM client, query functions
│   └── routers.ts              # Main appRouter aggregating sub-routers
├── shared/                     # Isomorphic TypeScript models & constants
│   ├── commerce/types.ts       # Backend-agnostic commerce types (Money, Product, Cart)
│   └── const.ts                # Session cookie names & OAuth state serializer
├── drizzle/                    # Database migrations & schema
│   ├── schema.ts               # Drizzle table definitions (users, content, seo, orders)
│   ├── 0000_bitter_trish_tilby.sql # Initial migration (missing users & orders)
│   └── migrations/0001_orders.sql  # Isolated orders migration
├── package.json                # Dependencies & npm scripts
├── tsconfig.json               # TypeScript compiler config
└── vite.config.ts              # Vite 7 build & plugins
```

---

## 2. Hardcoded Single-Book Assumptions (Step 2 Audit)

The audit revealed that while the UI styling and branding are high quality, several critical layers of the application assume *“B2B Brand Management — Tunisia Edition”* is the only book in existence:

### 2.1 Backend Order Validation Constraint
In `server/routers/site.ts` (lines 18–20):
```typescript
const orderInput = z.object({
  firstName: z.string().trim().min(2).max(120),
  lastName: z.string().trim().min(2).max(120),
  email: z.string().email().max(320),
  phone: z.string().trim().min(6).max(80),
  deliveryAddress: z.string().trim().min(10).max(1200),
  quantity: z.number().int().min(1).max(20),
  educator: z.boolean().default(false),
  productHandle: z.literal("b2b-brand-management"),               // <-- HARDCODED
  productTitle: z.literal("B2B Brand Management — Tunisia Edition") // <-- HARDCODED
});
```
*Impact*: Any order submitted for any other product will be rejected with a Zod validation error.

### 2.2 Database Flat Single-Product Order Table
In `drizzle/schema.ts` (lines 91–106):
* The `orders` table stores `productHandle`, `productTitle`, and `quantity` directly as columns.
* There is no `order_items` table.
* There are no price snapshots (`unitPrice`, `subtotal`, `totalAmount`, `currency`).
* *Impact*: The database is structurally incapable of handling an order with multiple different books (e.g., Book A × 1 + Book B × 2).

### 2.3 Storefront Routing & Hardcoded Page
* In `client/src/App.tsx`:
  * Route `/livres/b2b-brand-management` maps to `B2BBook.tsx`.
  * `B2BBook.tsx` has all book copy, pricing, gallery photos, authors, and Tunisian company logos hardcoded directly inside JSX.
  * `client/src/components/storefront/SiteHeader.tsx` mobile menu button links explicitly to `/livres/b2b-brand-management`.
* In `client/src/pages/ProductDetail.tsx` (lines 110–117):
  * Educator promo block appears conditionally via:
    `product.title.toLowerCase().includes("b2b brand")`.
* In `client/src/pages/Home.tsx`:
  * The entire homepage is structured around *B2B Brand Management* as a solitary title rather than a featured hero product leading into a wider collection.

---

## 3. Proprietary Dependencies Audit (Step 3 Audit)

The application cannot be deployed independently because it is bound to the proprietary development container platform (Manus/Antigravity):

1. **Manus OAuth Auth Lock-In**:
   * `server/_core/oauth.ts` & `server/_core/sdk.ts`:
     Calls `webdev.v1.WebDevAuthPublicService/ExchangeToken` and `GetUserInfo` on `ENV.oAuthServerUrl`.
   * `client/src/_core/hooks/useAuth.ts` & `client/src/const.ts`:
     Redirects user to `VITE_OAUTH_PORTAL_URL/app-auth`.
   * *Status*: On any standard VPS, Docker, or Cloud hosting, clicking Login or attempting to access `/admin` will fail completely.
2. **Storage Proxy Lock-In**:
   * `server/_core/storageProxy.ts`:
     Captures `/manus-storage/*` requests and proxies them to `BUILT_IN_FORGE_API_URL` using `BUILT_IN_FORGE_API_KEY`.
   * `client/src/pages/Shop.tsx` (line 38):
     `<img src="/manus-storage/atelier-business-categories_615829ef.jpg" />`.
   * *Status*: On a standard server, this image fails with an HTTP 500/502 error.
3. **Vite Plugin Runtime**:
   * `package.json` contains `vite-plugin-manus-runtime: "0.0.59"`.
   * *Status*: Unnecessary dev-runtime overlay that must be cleanly decoupled for production stability.

---

## 4. Shopify Dependencies Audit (Step 4 Audit)

The repository currently exhibits an architectural contradiction:
1. **The Codebase Has a Full Shopify Headless Client**:
   * `server/_core/shopify.ts`: Implements GraphQL queries and mutations (`listProducts`, `getProductByHandle`, `createCart`, `addCartLines`, `updateCartLines`, `removeCartLines`).
   * `server/routers/commerce.ts`: Directly exposes these Shopify endpoints over tRPC.
   * `client/src/contexts/CartContext.tsx`: Manages cart state by calling Shopify tRPC procedures and redirecting to Shopify Checkout (`cart.checkoutUrl`).
   * `client/src/pages/Shop.tsx` & `ProductDetail.tsx`: Query Shopify for catalog data.
2. **The Business Reality in Tunisia**:
   * Shopify Checkout is unsuited for Tunisian Dinar (TND) Cash-on-Delivery without international gateways, prompting the previous developer to introduce a separate local COD form in `B2BBook.tsx`.
   * The Shopify store is unconfigured (`SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` are empty).
   * As a result, visiting `/librairie` renders an empty or failed state.
3. **Architectural Decision (Per Master Prompt)**:
   * **Shopify is eliminated**. The bookstore must be 100% self-contained with internal MySQL catalog tables (`products`, `categories`, `authors`, `product_images`) and an internal multi-product COD cart/checkout.

---

## 5. Database & Migration Inconsistencies Audit (Step 5 Audit)

1. **Split & Missing Tables in Migrations**:
   * `drizzle/0000_bitter_trish_tilby.sql` only creates `analytics_events`, `content_sections`, and `seo_pages`.
   * `drizzle/schema.ts` defines `users`, but it is **nowhere in the SQL migration files**.
   * `drizzle/migrations/0001_orders.sql` creates `orders`, but it lacks multi-item relations and historical prices.
2. **Missing Relational Entities for a Real Bookstore**:
   * No `products` table.
   * No `categories` table.
   * No `authors` table.
   * No `product_authors` table.
   * No `product_images` table.
   * No `order_items` table.
3. **Authentication Gaps in Database**:
   * `users` table only has `openId` (designed for OAuth) and no `passwordHash` column for secure native authentication.

---

## 6. Proposed Architectural Transformation

To convert LivresPro.tn into a production-ready, scalable bookstore that launches with *B2B Brand Management* as Product #1:

```
                            LIVRESPRO.TN (PRODUCTION)
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
     PUBLIC STOREFRONT                                         ADMIN CMS
 ┌──────────────────────┐                               ┌──────────────────────┐
 │ - Dynamic Home Hero  │                               │ - Product Management │
 │ - Bookstore (/shop)  │                               │ - Category Manager   │
 │ - Product Page (PDP) │                               │ - Author Manager     │
 │ - Category Filtering │                               │ - Multi-Item Orders  │
 │ - Authors Showcase   │                               │ - CSV Order Export   │
 │ - Multi-Product Cart │                               │ - SEO & Analytics    │
 │ - Multi-Product COD  │                               │ - Native Auth (JWT)  │
 └──────────┬───────────┘                               └──────────┬───────────┘
            │                                                      │
            └──────────────────────────┬───────────────────────────┘
                                       ▼
                       UNIFIED INTERNAL tRPC API
                         (server/routers/*)
                                       │
                                       ▼
                     DRIZZLE ORM / MYSQL 8.0 ENGINE
         ┌─────────────────────────────────────────────────────────┐
         │ products · categories · authors · product_authors       │
         │ product_images · orders · order_items · users           │
         │ content_sections · seo_pages · analytics_events         │
         └─────────────────────────────────────────────────────────┘
```

---

## 7. Immediate Next Steps

1. Review and approve the **Implementation Plan** (`implementation_plan.md`).
2. Implement the unified MySQL database schema with complete Drizzle migration.
3. Replace proprietary authentication with native email/password + bcrypt + JWT sessions.
4. Replace Shopify adapter with native MySQL catalog and multi-product cart/checkout service.
5. Seed *B2B Brand Management — Tunisia Edition* as Product #1 along with its authors, categories, and gallery images.
6. Upgrade Admin dashboard to manage catalog, orders, and export data.
7. Conduct production build, test multi-product scalability, and produce final documentation.
