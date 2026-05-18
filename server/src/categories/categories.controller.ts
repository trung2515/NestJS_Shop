import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/public.decorator';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Public()
  @Get()
  findAll() {
    return this.categories.findAll();
  }
}
