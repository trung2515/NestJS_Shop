import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(private readonly dataSource: DataSource) {}

  salesReport() {
    return this.dataSource.query(`
      SELECT
        date_trunc('day', o."createdAt")::date AS day,
        COUNT(*)::int AS orders,
        SUM(o."totalAmount")::numeric(12,2) AS revenue
      FROM orders o
      WHERE o.status IN ('PAID', 'SHIPPED')
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 30
    `);
  }

  topProducts() {
    return this.dataSource.query(`
      SELECT
        p.id,
        p.name,
        p.brand,
        SUM(oi.quantity)::int AS sold,
        SUM(oi.quantity * oi."unitPrice")::numeric(12,2) AS revenue
      FROM order_items oi
      JOIN products p ON p.id = oi."productId"
      JOIN orders o ON o.id = oi."orderId"
      WHERE o.status IN ('PAID', 'SHIPPED')
      GROUP BY p.id, p.name, p.brand
      ORDER BY sold DESC
      LIMIT 10
    `);
  }

  lowStock() {
    return this.dataSource.query(`
      SELECT id, name, brand, stock
      FROM products
      WHERE stock <= 10 AND "isActive" = true
      ORDER BY stock ASC, name ASC
    `);
  }
}
