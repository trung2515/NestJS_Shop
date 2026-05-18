import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem, Product, User } from '../database/entities';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, User])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
