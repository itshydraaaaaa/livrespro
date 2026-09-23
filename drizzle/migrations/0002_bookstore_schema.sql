-- LivresPro.tn Unified Relational Bookstore Schema Migration (0002)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(320) NOT NULL UNIQUE,
  `passwordHash` varchar(255) NOT NULL,
  `name` varchar(180) NULL,
  `role` enum('user', 'admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(120) NOT NULL,
  `slug` varchar(120) NOT NULL UNIQUE,
  `description` text NULL,
  `image` text NULL,
  `parentId` int NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  `seoTitle` varchar(180) NULL,
  `seoDescription` varchar(320) NULL,
  `status` enum('active', 'inactive') NOT NULL DEFAULT 'active',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Authors Table
CREATE TABLE IF NOT EXISTS `authors` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(180) NOT NULL,
  `slug` varchar(180) NOT NULL UNIQUE,
  `biography` text NULL,
  `photo` text NULL,
  `website` varchar(300) NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(300) NOT NULL,
  `slug` varchar(180) NOT NULL UNIQUE,
  `sku` varchar(80) NULL,
  `shortDescription` text NULL,
  `description` text NOT NULL,
  `descriptionHtml` text NULL,
  `productType` varchar(80) NOT NULL DEFAULT 'Livre',
  `format` enum('PHYSICAL_BOOK', 'DIGITAL_BOOK', 'EBOOK', 'AUDIOBOOK', 'OTHER') NOT NULL DEFAULT 'PHYSICAL_BOOK',
  `price` varchar(32) NOT NULL,
  `compareAtPrice` varchar(32) NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'TND',
  `stockQuantity` int NOT NULL DEFAULT 100,
  `availabilityStatus` enum('in_stock', 'out_of_stock', 'preorder') NOT NULL DEFAULT 'in_stock',
  `isbn` varchar(40) NULL,
  `publisher` varchar(180) NULL,
  `publicationDate` varchar(40) NULL,
  `language` varchar(40) NOT NULL DEFAULT 'Français',
  `pageCount` int NULL,
  `coverImage` text NULL,
  `categoryId` int NULL,
  `featured` int NOT NULL DEFAULT 0,
  `status` enum('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  `seoTitle` varchar(180) NULL,
  `seoDescription` varchar(320) NULL,
  `metadata` json NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_products_category` (`categoryId`),
  KEY `idx_products_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Product Authors Junction
CREATE TABLE IF NOT EXISTS `product_authors` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `productId` int NOT NULL,
  `authorId` int NOT NULL,
  `role` varchar(64) NOT NULL DEFAULT 'Auteur',
  `sortOrder` int NOT NULL DEFAULT 0,
  KEY `idx_pa_product` (`productId`),
  KEY `idx_pa_author` (`authorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Product Images Table
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `productId` int NOT NULL,
  `url` text NOT NULL,
  `alt` varchar(255) NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  `isPrimary` int NOT NULL DEFAULT 0,
  KEY `idx_pi_product` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `orderNumber` varchar(64) NOT NULL UNIQUE,
  `customerFirstName` varchar(120) NOT NULL,
  `customerLastName` varchar(120) NOT NULL,
  `customerEmail` varchar(320) NOT NULL,
  `customerPhone` varchar(80) NOT NULL,
  `deliveryAddress` text NOT NULL,
  `city` varchar(120) NULL,
  `governorate` varchar(120) NULL,
  `postalCode` varchar(20) NULL,
  `orderNotes` text NULL,
  `isEducator` int NOT NULL DEFAULT 0,
  `subtotal` varchar(32) NOT NULL DEFAULT '0.00',
  `shippingCost` varchar(32) NOT NULL DEFAULT '7.00',
  `discountAmount` varchar(32) NOT NULL DEFAULT '0.00',
  `totalAmount` varchar(32) NOT NULL DEFAULT '0.00',
  `currency` varchar(10) NOT NULL DEFAULT 'TND',
  `paymentMethod` varchar(64) NOT NULL DEFAULT 'cash_on_delivery',
  `paymentStatus` enum('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `status` enum('new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'new',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_created` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `orderId` int NOT NULL,
  `productId` int NULL,
  `productSlug` varchar(180) NOT NULL,
  `productTitle` varchar(300) NOT NULL,
  `format` varchar(80) NOT NULL DEFAULT 'Livre physique',
  `unitPrice` varchar(32) NOT NULL,
  `quantity` int NOT NULL DEFAULT 1,
  `subtotal` varchar(32) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_oi_order` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Content Sections Table
CREATE TABLE IF NOT EXISTS `content_sections` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `key` varchar(80) NOT NULL UNIQUE,
  `eyebrow` varchar(120) NULL,
  `title` varchar(240) NOT NULL,
  `body` text NULL,
  `ctaLabel` varchar(80) NULL,
  `ctaHref` varchar(500) NULL,
  `imageUrl` text NULL,
  `status` enum('draft', 'published') NOT NULL DEFAULT 'draft',
  `updatedBy` int NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. SEO Pages Table
CREATE TABLE IF NOT EXISTS `seo_pages` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `path` varchar(500) NOT NULL UNIQUE,
  `title` varchar(160) NOT NULL,
  `description` varchar(320) NOT NULL,
  `ogTitle` varchar(160) NULL,
  `ogDescription` varchar(320) NULL,
  `canonicalUrl` varchar(500) NULL,
  `robots` enum('index', 'noindex') NOT NULL DEFAULT 'index',
  `updatedBy` int NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Analytics Events Table
CREATE TABLE IF NOT EXISTS `analytics_events` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `visitorId` varchar(64) NOT NULL,
  `sessionId` varchar(64) NOT NULL,
  `eventType` varchar(64) NOT NULL,
  `path` varchar(500) NOT NULL,
  `referrer` varchar(500) NULL,
  `metadata` json NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_analytics_created` (`createdAt`),
  KEY `idx_analytics_event` (`eventType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
