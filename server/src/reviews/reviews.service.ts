import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, Review, User } from '../database/entities';
import { CreateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const product = await this.products.findOneBy({ id: dto.productId });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.reviews.findOne({
      where: { user: { id: userId }, product: { id: dto.productId } },
    });

    const review = existing ?? this.reviews.create({ user: { id: userId } as User, product });
    review.rating = dto.rating;
    review.comment = dto.comment;
    return this.reviews.save(review);
  }
}
