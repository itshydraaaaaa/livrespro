# LivresPro.tn — Production QA & Verification Checklist

**Date**: September 2026  
**Target Environment**: Production (livrespro.tn)  

---

## 1. Storefront & Catalog Verification

| Check | Expected Behavior | Status |
| :--- | :--- | :---: |
| **Homepage Load** | Loads `/` displaying brand identity, authors (Kotler, Pfoertsch, Kallel), case studies logos, and hero book without errors. | PASS |
| **Header Navigation** | Links to *La Librairie*, *Le livre*, *Études de cas*, *Pour les enseignants*, *Le lancement*, and *Panier* work seamlessly. | PASS |
| **Shop Page (`/librairie`)** | Displays published books in a responsive grid with category tag filters, formatted prices in TND, and cover images. | PASS |
| **Product Detail (`/livres/:slug`)** | Dynamically fetches book by slug, displays gallery covers, authors, format, description, and "Ajouter à ma sélection" button. | PASS |
| **Multi-Author Display** | Books with multiple authors (e.g. Kotler, Pfoertsch, Kallel) display all authors separated by bullets. | PASS |
| **Educator Offer Section** | Displayed on product pages and dedicated `/educators` page with −50% companion benefit explanation. | PASS |

---

## 2. Multi-Product Cart & Cash-on-Delivery (COD)

| Check | Expected Behavior | Status |
| :--- | :--- | :---: |
| **Add Single Product** | Clicking "Ajouter à ma sélection" increments cart counter and opens `CartDrawer`. | PASS |
| **Add Multiple Products** | Multiple different books can coexist in the cart with independent quantities and totals. | PASS |
| **Cart Quantity Controls** | Clicking `+` or `−` updates the line quantity, line total, and subtotal in real time. Setting quantity to 0 removes line. | PASS |
| **Cart Persistence** | Refreshing the browser preserves the cart contents from `localStorage`. | PASS |
| **Checkout Modal Trigger** | Clicking "Commander · Paiement à la livraison" closes drawer and opens `CheckoutModal`. | PASS |
| **Tunisian Order Fields** | Form collects Name, Joignable Phone, Email, Address, Governorate dropdown (24 Tunisian governorates), and Educator checkbox. | PASS |
| **Order Placement** | Submitting the form creates records in `orders` and `order_items` tables, returns friendly order reference (e.g., `#LP-2026-XXXX`), and clears cart. | PASS |

---

## 3. Administration & Back-Office

| Check | Expected Behavior | Status |
| :--- | :--- | :---: |
| **Admin Route Protection** | Navigating to `/admin` without an active admin session redirects to `/login`. | PASS |
| **Native Login (`/login`)** | Submitting valid email & password sets secure HTTP-only cookie and redirects to `/admin`. Invalid credentials show alert. | PASS |
| **Orders Dashboard** | Displays all customer orders with customer name, phone, governorate, address, line items, and total in TND. | PASS |
| **Order Status Update** | Changing dropdown status (e.g. `new` $\rightarrow$ `confirmed` $\rightarrow$ `shipped`) updates the database in real time. | PASS |
| **CSV Order Export** | Clicking "Exporter CSV" downloads a courier-ready spreadsheet with all recipient addresses and items. | PASS |
| **Book Catalog Management** | Admin can create new books, edit existing titles, adjust price (TND), stock, format, and toggle published/draft status. | PASS |
| **Category & Author Managers** | Admin can create and modify bookstore categories and author biographies. | PASS |

---

## 4. Technical & Security Review

| Check | Expected Behavior | Status |
| :--- | :--- | :---: |
| **Zero Proprietary Locks** | Codebase contains no active calls to Manus WebDev OAuth or Forge storage proxies. | PASS |
| **Zero Shopify Reliance** | Catalog and checkout operate 100% locally from the MySQL database. | PASS |
| **Zero Plaintext Passwords** | Passwords hashed using cryptographic salt + `scryptSync(64)`. | PASS |
| **Type Safety** | Complete TypeScript compilation with shared backend-agnostic schemas. | PASS |
