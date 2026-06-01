import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, Product, ProductImage } from '../database/entities';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Category) private readonly categories: Repository<Category>,
    @InjectRepository(ProductImage) private readonly images: Repository<ProductImage>,
  ) {}

  async findAll(query: ProductQueryDto) {
    const qb = this.products
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .loadRelationCountAndMap('product.reviewCount', 'product.reviews')
      .where('product.isActive = true')
      .orderBy('product.createdAt', 'DESC');

    if (query.categoryId)
      qb.andWhere('category.id = :categoryId', { categoryId: query.categoryId });
    if (query.q) {
      qb.andWhere(
        `to_tsvector('simple', product.name || ' ' || product.brand || ' ' || product.description) @@ plainto_tsquery('simple', :q)`,
        { q: query.q },
      );
    }

    return qb.getMany();
  }

  async findOne(id: string) {
    const product = await this.products.findOne({
      where: { id },
      relations: { images: true, reviews: { user: true } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    const category = await this.categories.findOneBy({ id: dto.categoryId });
    if (!category) throw new NotFoundException('Category not found');

    const product = this.products.create({
      ...dto,
      price: dto.price.toFixed(2),
      category,
      images: dto.imageUrls?.map((url, index) => ({ url, isPrimary: index === 0 }) as ProductImage),
    });
    return this.products.save(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    const category = await this.categories.findOneBy({ id: dto.categoryId });
    if (!category) throw new NotFoundException('Category not found');

    await this.images
      .createQueryBuilder()
      .delete()
      .where('"productId" = :productId', { productId: id })
      .execute();
    Object.assign(product, {
      ...dto,
      price: dto.price.toFixed(2),
      category,
      images: dto.imageUrls?.map((url, index) => ({ url, isPrimary: index === 0 }) as ProductImage),
    });
    return this.products.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    product.isActive = false;
    return this.products.save(product);
  }
}
