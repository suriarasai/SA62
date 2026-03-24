-- ============================================================
--  Choppee – schema.sql
--  MySQL 8.x compatible DDL
--  All tables dropped and recreated on startup.
-- ============================================================
USE RESTAPP;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS product_tags;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ── users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id         BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    email      VARCHAR(120) NOT NULL UNIQUE,
    password   VARCHAR(120) NOT NULL,
    first_name VARCHAR(60),
    last_name  VARCHAR(60),
    birth_date DATE,
    created_at DATETIME,
    active     BOOLEAN      DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── categories ───────────────────────────────────────────────────────────────
CREATE TABLE categories (
    id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(80)  NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── tags ─────────────────────────────────────────────────────────────────────
CREATE TABLE tags (
    id   BIGINT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── products (ManyToOne → categories) ────────────────────────────────────────
CREATE TABLE products (
    id               BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(120) NOT NULL,
    description      TEXT,
    brand            VARCHAR(80),
    price            DOUBLE       NOT NULL,
    discount_percent DOUBLE       DEFAULT 0.0,
    stock_quantity   INT          DEFAULT 0,
    image_url        VARCHAR(255),
    created_at       DATETIME,
    active           BOOLEAN      DEFAULT TRUE,
    category_id      BIGINT       NOT NULL,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── product_tags (ManyToMany join table) ─────────────────────────────────────
CREATE TABLE product_tags (
    product_id BIGINT NOT NULL,
    tag_id     BIGINT NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    CONSTRAINT fk_pt_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_pt_tag     FOREIGN KEY (tag_id)     REFERENCES tags(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── carts (OneToOne → users) ─────────────────────────────────────────────────
CREATE TABLE carts (
    id         BIGINT   NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT   NOT NULL UNIQUE,
    created_at DATETIME,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── cart_items (ManyToOne → carts, ManyToOne → products) ─────────────────────
CREATE TABLE cart_items (
    id         BIGINT   NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cart_id    BIGINT   NOT NULL,
    product_id BIGINT   NOT NULL,
    quantity   INT      NOT NULL DEFAULT 1,
    added_at   DATETIME,
    CONSTRAINT fk_ci_cart    FOREIGN KEY (cart_id)    REFERENCES carts(id),
    CONSTRAINT fk_ci_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── purchase_orders (ManyToOne → users) ──────────────────────────────────────
CREATE TABLE purchase_orders (
    id               BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT        NOT NULL,
    total_amount     DOUBLE        NOT NULL,
    shipping_address VARCHAR(500),
    notes            VARCHAR(300),
    `status`         VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    order_date       DATETIME      NOT NULL,
    delivered_at     DATETIME,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── order_items (ManyToOne → purchase_orders, ManyToOne → products) ──────────
CREATE TABLE order_items (
    id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id   BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity   INT    NOT NULL,
    unit_price DOUBLE NOT NULL,
    CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES purchase_orders(id),
    CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
