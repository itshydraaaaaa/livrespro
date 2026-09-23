# LivresPro.tn — Database Specification & Schema

**Database Engine**: MySQL 8.0+  
**ORM**: Drizzle ORM (`drizzle-orm/mysql-core`)  
**Dialect**: MySQL  

---

## 1. Relational Entity Relationship Diagram

```mermaid
erDiagram
    users {
        int id PK
        varchar email UK
        varchar passwordHash
        varchar name
        enum role
        timestamp createdAt
        timestamp updatedAt
        timestamp lastSignedIn
    }

    categories {
        int id PK
        varchar name
        varchar slug UK
        text description
        text image
        int parentId
        int sortOrder
        enum status
        timestamp createdAt
        timestamp updatedAt
    }

    authors {
        int id PK
        varchar name
        varchar slug UK
        text biography
        text photo
        varchar website
        timestamp createdAt
        timestamp updatedAt
    }

    products {
        int id PK
        varchar title
        varchar slug UK
        varchar sku
        text shortDescription
        text description
        varchar productType
        enum format
        varchar price
        varchar compareAtPrice
        varchar currency
        int stockQuantity
        enum availabilityStatus
        varchar isbn
        varchar publisher
        varchar publicationDate
        varchar language
        int pageCount
        text coverImage
        int categoryId FK
        int featured
        enum status
        json metadata
        timestamp createdAt
        timestamp updatedAt
    }

    product_authors {
        int id PK
        int productId FK
        int authorId FK
        varchar role
        int sortOrder
    }

    product_images {
        int id PK
        int productId FK
        text url
        varchar alt
        int sortOrder
        int isPrimary
    }

    orders {
        int id PK
        varchar orderNumber UK
        varchar customerFirstName
        varchar customerLastName
        varchar customerEmail
        varchar customerPhone
        text deliveryAddress
        varchar city
        varchar governorate
        varchar postalCode
        text orderNotes
        int isEducator
        varchar subtotal
        varchar shippingCost
        varchar discountAmount
        varchar totalAmount
        varchar currency
        varchar paymentMethod
        enum paymentStatus
        enum status
        timestamp createdAt
        timestamp updatedAt
    }

    order_items {
        int id PK
        int orderId FK
        int productId FK
        varchar productSlug
        varchar productTitle
        varchar format
        varchar unitPrice
        int quantity
        varchar subtotal
        timestamp createdAt
    }

    categories ||--o{ products : contains
    products ||--o{ product_authors : relates
    authors ||--o{ product_authors : writes
    products ||--o{ product_images : has
    orders ||--|{ order_items : contains
    products ||--o{ order_items : ordered_as
```

---

## 2. Table Specifications

### 2.1 `products`
* Stores all books and digital publications.
* `price`: Stored as a decimal string (e.g. `"65.00"`) to avoid floating-point inaccuracies.
* `format`: `PHYSICAL_BOOK`, `DIGITAL_BOOK`, `EBOOK`, `AUDIOBOOK`, `OTHER`.
* `availabilityStatus`: `in_stock`, `out_of_stock`, `preorder`.
* `status`: `draft` (hidden), `published` (storefront), `archived`.

### 2.2 `categories`
* Organizes catalog into distinct business sections (e.g., *Marketing & Marque*, *Management & Leadership*, *Stratégie & Innovation*).
* `slug`: URL-friendly identifier used for filtering on `/librairie`.

### 2.3 `authors` & `product_authors`
* Supports multiple co-authors per book (e.g., Philip Kotler, Waldemar Pfoertsch, Walid Kallel for *B2B Brand Management*).
* `role`: Describes contribution (*Auteur*, *Co-auteur*, *Préfacier*).

### 2.4 `orders` & `order_items`
* `orderNumber`: Human-readable reference number (e.g., `LP-2026-9481`).
* `paymentMethod`: Defaulted to `cash_on_delivery` (Paiement à la livraison).
* `status`: `new` $\rightarrow$ `confirmed` $\rightarrow$ `processing` $\rightarrow$ `shipped` $\rightarrow$ `delivered` $\rightarrow$ `cancelled`.
* `order_items`: Snapshots `productTitle`, `format`, and `unitPrice` at the time of purchase, preserving historical accuracy even if catalog prices change later.

### 2.5 `users`
* Administrative accounts with native authentication.
* Passwords stored as `salt:scryptDerivedKey` hashes.
