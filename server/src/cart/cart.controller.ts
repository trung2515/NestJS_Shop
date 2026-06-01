import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrentUser, JwtUser } from '../common/current-user.decorator';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../database/entities';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto';

@Roles(UserRole.CUSTOMER)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  getCart(@CurrentUser() user: JwtUser) {
    return this.cart.getCart(user.sub);
  }

  @Post('items')
  addItem(@CurrentUser() user: JwtUser, @Body() dto: AddCartItemDto) {
    return this.cart.addItem(user.sub, dto);
  }

  @Delete('items/:id')
  removeItem(@CurrentUser() user: JwtUser, @Param('id') itemId: string) {
    return this.cart.removeItem(user.sub, itemId);
  }
}
