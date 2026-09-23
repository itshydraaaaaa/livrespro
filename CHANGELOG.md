# LivresPro.tn — Changelog

All notable changes made to transition LivresPro.tn into a production-ready, scalable online bookstore are documented here.

---

## [2.0.0] - September 2026

### Added
* **Relational Bookstore Database Model**:
  * Added `categories` table with slug, description, sort order, and status.
  * Added `authors` table with biographical details and photos.
  * Added `products` table supporting physical/digital books, formats, stock, ISBN, publisher, and prices.
  * Added `product_authors` junction table supporting multi-author titles.
  * Added `product_images` table supporting multi-image galleries.
  * Added `order_items` table with historical price and quantity snapshots.
* **Unified Database Migration**:
  * Generated `drizzle/migrations/0002_bookstore_schema.sql` creating all 11 tables cleanly.
* **Native Authentication Engine**:
  * Created `server/_core/auth.ts` with Node.js built-in `scrypt` salted password hashing and `jose` JWT cookies.
  * Added dedicated `/login` page with editorial styling.
  * Added role-based admin route protection without third-party OAuth.
* **Internal Bookstore Service**:
  * Created `server/services/bookstoreService.ts` to map database entities to backend-agnostic commerce types.
* **Multi-Product Cart & Checkout**:
  * Rewrote `client/src/contexts/CartContext.tsx` with native local state in TND Dinars.
  * Created `client/src/components/storefront/CheckoutModal.tsx` supporting multi-product Cash-on-Delivery with Tunisian governorate selection.
* **Admin Bookstore CMS**:
  * Upgraded `client/src/pages/Admin.tsx` with Product Manager, Category Manager, and Author Manager.
  * Enhanced Orders table with line item display, live status dropdown updater, and Courier CSV export.
* **Production Seeding**:
  * Created `server/seed.ts` populating *B2B Brand Management — Tunisia Edition* as Product #1, Philip Kotler, Waldemar Pfoertsch, Walid Kallel as authors, business categories, and test products for multi-product verification.
* **Documentation**:
  * Created `PROJECT_AUDIT.md`, `ARCHITECTURE.md`, `DATABASE.md`, `PRODUCTION_QA.md`, `DEPLOYMENT.md`, `CLIENT_DECISIONS.md`.

### Changed
* **Shopify Elimination**: Replaced external Shopify Storefront GraphQL queries with native MySQL database queries.
* **Site Header Navigation**: Added direct link to "La Librairie" (`/librairie`) alongside editorial anchors.
* **Static Assets**: Localized category and book photography into `client/public/editorial/`.

### Removed
* **Manus Dependencies**: Decommissioned `vite-plugin-manus-runtime`, `vitePluginManusDebugCollector`, `storageProxy.ts` Forge API forwarder, and Manus WebDev OAuth callback.
* **Single-Book Constraints**: Removed hardcoded `b2b-brand-management` Zod literal constraint from order submission.
