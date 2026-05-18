import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser, JwtUser } from '../common/current-user.decorator';
import { CreateReviewDto } from './dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateReviewDto) {
    return this.reviews.create(user.sub, dto);
  }
}
