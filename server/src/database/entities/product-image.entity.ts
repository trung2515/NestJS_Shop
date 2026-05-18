import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ type: 'text' })
  url: string;

  @Column({ default: false })
  isPrimary: boolean;
}
