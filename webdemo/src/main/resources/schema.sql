------------------------------------------------------------------------------------------- 
--  Schema.sql
--  H2 compatible DDL
--  All tables dropped and recreated on startup.
------------------------------------------------------------------------------------------- 

-- Users (String, LocalDate, LocalDateTime, Boolean)

DROP TABLE IF EXISTS product_tags;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS  tag;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS users;


------------------------------------------------------------------------------------------- 

CREATE TABLE users (
    id         BIGINT      AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    email      VARCHAR(120) NOT NULL UNIQUE,
    password   VARCHAR(120) NOT NULL,
    first_name VARCHAR(60),
    last_name  VARCHAR(60),
    dob DATE,                       -- java.time.LocalDate
    created_at TIMESTAMP,                  -- java.time.LocalDateTime
    active     BOOLEAN      DEFAULT TRUE
);

------------------------------------------------------------------------------------------- 

CREATE TABLE category (
    id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(80)  NOT NULL UNIQUE,
    description VARCHAR(255)
);

------------------------------------------------------------------------------------------- 
CREATE TABLE tag (
    id   BIGINT      AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);
