import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 120 })
  name: string;

  @Column({ unique: true, length: 140 })
  slug: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
