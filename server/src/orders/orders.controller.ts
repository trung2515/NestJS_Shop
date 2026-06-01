import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser, JwtUser } from '../common/current-user.decorator';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../database/entities';
import { CheckoutDto } from './dto';
import { OrdersService } from './orders.service';

@Roles(UserRole.CUSTOMER)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  myOrders(@CurrentUser() user: JwtUser) {
    return this.orders.myOrders(user.sub);
  }

  @Post('checkout')
  checkout(@CurrentUser() user: JwtUser, @Body() dto: CheckoutDto) {
    return this.orders.checkout(user.sub, dto);
  }
}
