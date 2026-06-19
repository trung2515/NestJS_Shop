import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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
    const keyword = query.q?.trim();
    if (keyword) {
      const normalizedKeyword = keyword.toLowerCase();
      const compactKeyword = normalizedKeyword.replace(/[^a-z0-9]+/g, '');
      qb.andWhere(
        new Brackets((search) => {
          search
            .where('LOWER(product.name) LIKE :keyword')
            .orWhere('LOWER(product.slug) LIKE :keyword')
            .orWhere('LOWER(product.brand) LIKE :keyword')
            .orWhere('LOWER(product.description) LIKE :keyword')
            .orWhere('LOWER(category.name) LIKE :keyword')
            .orWhere(
              `regexp_replace(
                LOWER(product.name || ' ' || product.slug || ' ' || product.brand || ' ' || product.description || ' ' || category.name),
                '[^a-z0-9]+',
                '',
                'g'
              ) LIKE :compactKeyword`,
            );
        }),
        {
          keyword: `%${normalizedKeyword}%`,
          compactKeyword: compactKeyword ? `%${compactKeyword}%` : '__no_compact_keyword__',
        },
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
