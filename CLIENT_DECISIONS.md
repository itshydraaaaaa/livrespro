# LivresPro.tn — Client Operational Decisions Log

This document records the default engineering assumptions made to allow immediate technical completion, alongside the specific business parameters reserved for client confirmation.

---

## 1. Resolved Technical Decisions

| Technical Decision | Selected Approach | Rationale |
| :--- | :--- | :--- |
| **Catalog Architecture** | **Full Relational Bookstore** | Option B selected: Single-book hardcoding removed. Platform supports unlimited books, authors, and categories. |
| **Payment Method** | **Cash on Delivery (COD)** | Avoids international gateway limitations in Tunisia; provides zero-friction ordering for local managers and companies. |
| **Authentication Engine** | **Standalone Email + Password** | Replaced proprietary Manus OAuth with salted scrypt hashing and secure JWT cookies, making the site 100% self-hosted. |
| **Media Hosting** | **Local Public Storage** | Replaced `/manus-storage/` Forge proxy with standard web-accessible assets in `client/public/editorial/`. |
| **Currency Display** | **Tunisian Dinar (TND)** | Configured as default across all catalog and cart formatters (e.g., `65,00 DT`). |

---

## 2. Business Parameters for Client Confirmation

The following operational details can be adjusted directly from the admin panel or `.env` file without modifying source code:

### Item 1: Domestic Delivery Flat Rate
* **Current Technical Assumption**: `7.000 DT` flat shipping fee added to order subtotal across all 24 Tunisian governorates.
* **Client Options**: Can be adjusted to free shipping above a certain threshold (e.g. gratuit dès 100 DT) or variable by distance.
* **Technical Impact**: Configurable via `shippingCost` in checkout and order calculation.

### Item 2: Courier & Logistics Partner
* **Current Technical Assumption**: Orders are stored in the database and exported via a courier-compatible CSV format from `/admin/commandes`.
* **Client Options**: Partner with Aramex, Livri, First Delivery, or local corporate messengers.
* **Next Steps**: When a carrier is selected, direct webhook API integration can be added if desired.

### Item 3: Transactional Email Gateway
* **Current Technical Assumption**: Notifications are logged and managed within the admin dashboard.
* **Client Options**: Select an email provider (Mailjet, SendGrid, Resend, or corporate SMTP server like `smtp.business-success.tn`).
* **Next Steps**: Add SMTP credentials to `.env` once selected.

### Item 4: Educator Status Validation Policy
* **Current Technical Assumption**: Educator checkbox marks `isEducator = 1` on the order. The back-office team verifies academic proof prior to emailing the companion digital guide.
* **Client Options**: Maintain manual telephone/email proof verification or establish institutional whitelists (`@institution.tn`).
