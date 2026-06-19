import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem, Product, User } from '../database/entities';
import { AddCartItemDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly carts: Repository<Cart>,
    @InjectRepository(CartItem) private readonly items: Repository<CartItem>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async getCart(userId: string) {
    const cart = await this.ensureCart(userId);
    return this.carts.findOne({
      where: { id: cart.id },
      relations: { items: { product: { images: true, category: true } } },
    });
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.ensureCart(userId);
    const product = await this.products.findOneBy({ id: dto.productId, isActive: true });
    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < dto.quantity) throw new BadRequestException('Not enough stock');

    const existing = await this.items.findOne({
      where: { cart: { id: cart.id }, product: { id: product.id } },
    });
    if (existing) {
      existing.quantity += dto.quantity;
      if (existing.quantity > product.stock) throw new BadRequestException('Not enough stock');
      return this.items.save(existing);
    }

    return this.items.save({ cart, product, quantity: dto.quantity });
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.ensureCart(userId);
    const item = await this.items.findOne({
      where: { id: itemId, cart: { id: cart.id } },
      relations: { product: true },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    if (!item.product.isActive) throw new BadRequestException('Product is unavailable');
    if (item.product.stock < dto.quantity) throw new BadRequestException('Not enough stock');

    item.quantity = dto.quantity;
    return this.items.save(item);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.ensureCart(userId);
    const item = await this.items.findOne({ where: { id: itemId, cart: { id: cart.id } } });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.items.remove(item);
    return { ok: true };
  }

  private async ensureCart(userId: string) {
    let cart = await this.carts.findOne({ where: { user: { id: userId } } });
    if (cart) return cart;

    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    cart = await this.carts.save({ user });
    return cart;
  }
}
