import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { ProductImage } from './product-image.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 180 })
  name: string;

  @Column({ unique: true, length: 200 })
  slug: string;

  @Column({ length: 120 })
  brand: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: string;

  @Column({ type: 'int' })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => CartItem, (item) => item.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
