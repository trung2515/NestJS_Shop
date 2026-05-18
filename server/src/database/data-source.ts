import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  Address,
  Cart,
  CartItem,
  Category,
  Order,
  OrderItem,
  Payment,
  Product,
  ProductImage,
  Review,
  User,
} from './entities';
import { InitShopNest1710000000000 } from './migrations/1710000000000-InitShopNest';

config({ path: '.env' });
config({ path: '.env.example' });

const entityList = [Address, Cart, CartItem, Category, Order, OrderItem, Payment, Product, ProductImage, Review, User];

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: Number(configService.get('DB_PORT', 5432)),
  username: configService.get('DB_USER', 'shopnest'),
  password: configService.get('DB_PASSWORD', 'shopnest123'),
  database: configService.get('DB_NAME', 'shopnest'),
  entities: entityList,
  synchronize: false,
  logging: configService.get('DB_LOGGING', 'false') === 'true',
});

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'shopnest',
  password: process.env.DB_PASSWORD ?? 'shopnest123',
  database: process.env.DB_NAME ?? 'shopnest',
  entities: entityList,
  migrations: [InitShopNest1710000000000],
  synchronize: false,
};

export default new DataSource(options);
