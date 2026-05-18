import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cart, Order, OrderItem, OrderStatus, Payment, PaymentStatus, Product, User } from '../database/entities';
import { CheckoutDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private readonly dataSource: DataSource) {}

  async myOrders(userId: string) {
    return this.dataSource.getRepository(Order).find({
      where: { user: { id: userId } },
      relations: { items: { product: true }, payment: true },
      order: { createdAt: 'DESC' },
    });
  }

  async checkout(userId: string, dto: CheckoutDto) {
    return this.dataSource.transaction(async (manager) => {
      const cart = await manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: { items: { product: true }, user: true },
      });
      if (!cart || cart.items.length === 0) throw new BadRequestException('Cart is empty');

      let total = 0;
      for (const item of cart.items) {
        const product = await manager.findOne(Product, {
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!product || !product.isActive) throw new BadRequestException('Product is unavailable');
        if (product.stock < item.quantity) throw new BadRequestException(`${product.name} is out of stock`);

        product.stock -= item.quantity;
        await manager.save(product);
        total += Number(product.price) * item.quantity;
      }

      const order = await manager.save(Order, {
        user: { id: userId } as User,
        status: OrderStatus.PAID,
        totalAmount: total.toFixed(2),
        shippingAddress: dto.shippingAddress,
      });

      const orderItems = cart.items.map((item) =>
        manager.create(OrderItem, {
          order,
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.product.price,
        }),
      );
      await manager.save(orderItems);

      const payment = manager.create(Payment, {
        order,
        provider: dto.paymentProvider,
        status: PaymentStatus.PAID,
        amount: total.toFixed(2),
      });
      await manager.save(payment);
      await manager
        .createQueryBuilder()
        .delete()
        .from('cart_items')
        .where('"cartId" = :cartId', { cartId: cart.id })
        .execute();

      return manager.findOneOrFail(Order, {
        where: { id: order.id },
        relations: { items: { product: true }, payment: true },
      });
    });
  }
}
