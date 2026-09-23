-- =============================================================================
-- LivresPro.tn — Schéma PostgreSQL Supabase & Données Initiales
-- Exécutez ce script dans l'éditeur SQL de votre Dashboard Supabase
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table Utilisateurs (Administrateurs & Équipe)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(180),
    role VARCHAR(32) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_signed_in TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table Rayons & Catégories
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INT NOT NULL DEFAULT 0,
    seo_title VARCHAR(180),
    seo_description VARCHAR(320),
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table Auteurs
CREATE TABLE IF NOT EXISTS authors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    biography TEXT,
    photo TEXT,
    website VARCHAR(300),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table Ouvrages & Produits
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    sku VARCHAR(80),
    short_description TEXT,
    description TEXT NOT NULL,
    description_html TEXT,
    product_type VARCHAR(80) NOT NULL DEFAULT 'Livre relié',
    format VARCHAR(40) NOT NULL DEFAULT 'PHYSICAL_BOOK',
    price VARCHAR(32) NOT NULL DEFAULT '65.00',
    compare_at_price VARCHAR(32) DEFAULT '85.00',
    currency VARCHAR(10) NOT NULL DEFAULT 'TND',
    stock_quantity INT NOT NULL DEFAULT 100,
    availability_status VARCHAR(40) NOT NULL DEFAULT 'in_stock',
    isbn VARCHAR(40),
    publisher VARCHAR(180),
    publication_date VARCHAR(40),
    language VARCHAR(40) NOT NULL DEFAULT 'Français',
    page_count INT,
    cover_image TEXT,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    featured INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'published',
    seo_title VARCHAR(180),
    seo_description VARCHAR(320),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Attribution Auteurs - Ouvrages
CREATE TABLE IF NOT EXISTS product_authors (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    author_id BIGINT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    role VARCHAR(64) NOT NULL DEFAULT 'Auteur',
    sort_order INT NOT NULL DEFAULT 0
);

-- 6. Galeries d'Images des Ouvrages
CREATE TABLE IF NOT EXISTS product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_primary INT NOT NULL DEFAULT 0
);

-- 7. Table Commandes (Cash-on-Delivery Tunisie)
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(64) NOT NULL UNIQUE,
    customer_first_name VARCHAR(120) NOT NULL,
    customer_last_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(320) NOT NULL,
    customer_phone VARCHAR(80) NOT NULL,
    delivery_address TEXT NOT NULL,
    city VARCHAR(120),
    governorate VARCHAR(120),
    postal_code VARCHAR(20),
    order_notes TEXT,
    is_educator INT NOT NULL DEFAULT 0,
    subtotal VARCHAR(32) NOT NULL DEFAULT '0.00',
    shipping_cost VARCHAR(32) NOT NULL DEFAULT '7.00',
    discount_amount VARCHAR(32) NOT NULL DEFAULT '0.00',
    total_amount VARCHAR(32) NOT NULL DEFAULT '0.00',
    currency VARCHAR(10) NOT NULL DEFAULT 'TND',
    payment_method VARCHAR(64) NOT NULL DEFAULT 'cash_on_delivery',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'pending',
    status VARCHAR(32) NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Lignes d'Articles de Commandes
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    product_slug VARCHAR(180) NOT NULL,
    product_title VARCHAR(300) NOT NULL,
    format VARCHAR(80) NOT NULL DEFAULT 'Livre physique',
    unit_price VARCHAR(32) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Blocs Éditoriaux
CREATE TABLE IF NOT EXISTS content_sections (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(80) NOT NULL UNIQUE,
    eyebrow VARCHAR(120),
    title VARCHAR(240) NOT NULL,
    body TEXT,
    cta_label VARCHAR(80),
    cta_href VARCHAR(500),
    image_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'draft',
    updated_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Pages SEO
CREATE TABLE IF NOT EXISTS seo_pages (
    id BIGSERIAL PRIMARY KEY,
    path VARCHAR(500) NOT NULL UNIQUE,
    title VARCHAR(160) NOT NULL,
    description VARCHAR(320) NOT NULL,
    og_title VARCHAR(160),
    og_description VARCHAR(320),
    canonical_url VARCHAR(500),
    robots VARCHAR(32) NOT NULL DEFAULT 'index',
    updated_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Événements d'Audience Anonymisés
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    visitor_id VARCHAR(64) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    path VARCHAR(500) NOT NULL,
    referrer VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INJECTION DES DONNÉES INITIALES (LIVRE PHARE PRODUIT N°1)
-- =============================================================================

-- Administrateur par défaut (admin@livrespro.tn / AdminLivresPro2026!)
INSERT INTO users (email, password_hash, name, role)
VALUES (
    'admin@livrespro.tn',
    '33b5c3ff411a7a012d93e874936d5e12:87cf8639a037bf0686940f90e0b35520e74f8cf1e5f32a688686cf46a0c50ca16a04874a18037feec2788f8d689622d17c76891eb69736c0e5a8d9bf1da38c82',
    'Direction LivresPro',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Catégories Business
INSERT INTO categories (name, slug, description, sort_order, status)
VALUES
    ('Stratégie & B2B', 'strategie-b2b', 'Ouvrages de référence en stratégie industrielle, positionnement et marketing B2B.', 1, 'active'),
    ('Marketing & Vente', 'marketing-vente', 'Méthodes de croissance, distribution et performance commerciale.', 2, 'active'),
    ('Entrepreneuriat & Leadership', 'entrepreneuriat', 'Guides pratiques pour fondateurs, dirigeants et managers.', 3, 'active')
ON CONFLICT (slug) DO NOTHING;

-- Auteurs du Livre N°1
INSERT INTO authors (name, slug, biography)
VALUES
    ('Philip Kotler', 'philip-kotler', 'Professeur émérite à la Kellogg School of Management, mondialement reconnu comme le père du marketing moderne.'),
    ('Waldemar Pfoertsch', 'waldemar-pfoertsch', 'Professeur international en marketing B2B et gestion de marque industrielle.'),
    ('Walid Kallel', 'walid-kallel', 'Expert en stratégie de marque et adaptation des modèles internationaux au contexte économique tunisien.')
ON CONFLICT (slug) DO NOTHING;

-- Produit N°1 : B2B Brand Management — Édition Tunisie
INSERT INTO products (
    title,
    slug,
    sku,
    short_description,
    description,
    description_html,
    product_type,
    format,
    price,
    compare_at_price,
    currency,
    stock_quantity,
    availability_status,
    isbn,
    publisher,
    publication_date,
    language,
    page_count,
    cover_image,
    category_id,
    featured,
    status,
    seo_title,
    seo_description,
    metadata
)
VALUES (
    'B2B Brand Management — Édition Tunisie',
    'b2b-brand-management-tunisia',
    'LIV-B2B-TN-001',
    'L’ouvrage de référence internationale adapté à l’économie tunisienne.',
    'L’ouvrage de référence internationale de Philip Kotler & Waldemar Pfoertsch, adapté au contexte économique et managérial tunisien par Walid Kallel. Inclus 7 cas réels d’entreprises tunisiennes (BIAT, Wallyscar, MSB, ARVEA, Gourmandise, MPBS, CHO Group).',
    '<p>L’ouvrage de référence internationale de <strong>Philip Kotler & Waldemar Pfoertsch</strong>, adapté au contexte économique et managérial tunisien par <strong>Walid Kallel</strong>.</p><p>Ce livre pose les fondements scientifiques et opérationnels de la marque dans le commerce inter-entreprises en Tunisie, illustré par 7 études de cas approfondies.</p>',
    'Livre relié',
    'PHYSICAL_BOOK',
    '65.00',
    '85.00',
    'TND',
    150,
    'in_stock',
    '978-9973-00-123-4',
    'L’Atelier des Pages / BUSINESS SUCCESS',
    '2026',
    'Français',
    384,
    '/business-success-logo.png',
    1,
    1,
    'published',
    'B2B Brand Management — Édition Tunisie | LivresPro.tn',
    'Commandez l’ouvrage de référence de Philip Kotler & Waldemar Pfoertsch adapté à la Tunisie avec 7 études de cas réels. Paiement à la livraison.',
    '{"case_studies": ["BIAT", "Wallyscar", "MSB", "ARVEA Nature", "Gourmandise", "MPBS", "CHO Group - Terra Delyssa"], "educator_discount": "50%"}'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Liaison Produit-Auteurs
INSERT INTO product_authors (product_id, author_id, role, sort_order)
SELECT p.id, a.id, 'Co-auteur', 1 FROM products p, authors a WHERE p.slug = 'b2b-brand-management-tunisia' AND a.slug = 'philip-kotler'
ON CONFLICT DO NOTHING;

INSERT INTO product_authors (product_id, author_id, role, sort_order)
SELECT p.id, a.id, 'Co-auteur', 2 FROM products p, authors a WHERE p.slug = 'b2b-brand-management-tunisia' AND a.slug = 'waldemar-pfoertsch'
ON CONFLICT DO NOTHING;

INSERT INTO product_authors (product_id, author_id, role, sort_order)
SELECT p.id, a.id, 'Auteur & Adaptateur Tunisie', 3 FROM products p, authors a WHERE p.slug = 'b2b-brand-management-tunisia' AND a.slug = 'walid-kallel'
ON CONFLICT DO NOTHING;

-- Image Principale
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary)
SELECT p.id, '/business-success-logo.png', 'Couverture B2B Brand Management — Tunisie', 1, 1 FROM products p WHERE p.slug = 'b2b-brand-management-tunisia'
ON CONFLICT DO NOTHING;
