import { IsIn } from 'class-validator';
import { OrderStatus } from '../database/entities';

export class UpdateOrderStatusDto {
  @IsIn([OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.CANCELLED])
  status: OrderStatus;
}
