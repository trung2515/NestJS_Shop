import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitShopNest1710000000000 implements MigrationInterface {
  name = 'InitShopNest1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN')`);
    await queryRunner.query(
      `CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED')`,
    );
    await queryRunner.query(`CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED')`);

    await queryRunner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "fullName" varchar(120) NOT NULL,
        email varchar(160) NOT NULL UNIQUE,
        "passwordHash" varchar NOT NULL,
        role user_role NOT NULL DEFAULT 'CUSTOMER',
        phone varchar(20),
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE addresses (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "receiverName" varchar(160) NOT NULL,
        phone varchar(20) NOT NULL,
        line1 varchar(255) NOT NULL,
        city varchar(120) NOT NULL,
        district varchar(120) NOT NULL,
        "isDefault" boolean NOT NULL DEFAULT false
      )
    `);

    await queryRunner.query(`
      CREATE TABLE categories (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar(120) NOT NULL UNIQUE,
        slug varchar(140) NOT NULL UNIQUE,
        description varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE products (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar(180) NOT NULL,
        slug varchar(200) NOT NULL UNIQUE,
        brand varchar(120) NOT NULL,
        description text NOT NULL,
        price numeric(12,2) NOT NULL,
        stock int NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "categoryId" uuid REFERENCES categories(id),
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT chk_products_price_positive CHECK (price > 0),
        CONSTRAINT chk_products_stock_non_negative CHECK (stock >= 0)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE product_images (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "productId" uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        url text NOT NULL,
        "isPrimary" boolean NOT NULL DEFAULT false
      )
    `);

    await queryRunner.query(`
      CREATE TABLE carts (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE cart_items (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "cartId" uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
        "productId" uuid NOT NULL REFERENCES products(id),
        quantity int NOT NULL,
        CONSTRAINT uq_cart_product UNIQUE ("cartId", "productId"),
        CONSTRAINT chk_cart_quantity_positive CHECK (quantity > 0)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE orders (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL REFERENCES users(id),
        status order_status NOT NULL DEFAULT 'PENDING',
        "totalAmount" numeric(12,2) NOT NULL,
        "shippingAddress" text NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT chk_orders_total_non_negative CHECK ("totalAmount" >= 0)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE order_items (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "orderId" uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        "productId" uuid NOT NULL REFERENCES products(id),
        quantity int NOT NULL,
        "unitPrice" numeric(12,2) NOT NULL,
        CONSTRAINT chk_order_quantity_positive CHECK (quantity > 0),
        CONSTRAINT chk_order_price_positive CHECK ("unitPrice" > 0)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE payments (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "orderId" uuid NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
        provider varchar(60) NOT NULL,
        status payment_status NOT NULL DEFAULT 'PENDING',
        amount numeric(12,2) NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT chk_payment_amount_positive CHECK (amount >= 0)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE reviews (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "productId" uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        rating int NOT NULL,
        comment text,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT uq_review_user_product UNIQUE ("userId", "productId"),
        CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5)
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_products_category ON products ("categoryId")`);
    await queryRunner.query(`CREATE INDEX idx_products_brand ON products (brand)`);
    await queryRunner.query(
      `CREATE INDEX idx_products_search ON products USING gin (to_tsvector('simple', name || ' ' || brand || ' ' || description))`,
    );
    await queryRunner.query(`CREATE INDEX idx_orders_user ON orders ("userId")`);
    await queryRunner.query(
      `CREATE INDEX idx_orders_status_created ON orders (status, "createdAt" DESC)`,
    );
    await queryRunner.query(`CREATE INDEX idx_order_items_product ON order_items ("productId")`);
    await queryRunner.query(`CREATE INDEX idx_reviews_product ON reviews ("productId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS reviews`);
    await queryRunner.query(`DROP TABLE IF EXISTS payments`);
    await queryRunner.query(`DROP TABLE IF EXISTS order_items`);
    await queryRunner.query(`DROP TABLE IF EXISTS orders`);
    await queryRunner.query(`DROP TABLE IF EXISTS cart_items`);
    await queryRunner.query(`DROP TABLE IF EXISTS carts`);
    await queryRunner.query(`DROP TABLE IF EXISTS product_images`);
    await queryRunner.query(`DROP TABLE IF EXISTS products`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories`);
    await queryRunner.query(`DROP TABLE IF EXISTS addresses`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS order_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role`);
  }
}
