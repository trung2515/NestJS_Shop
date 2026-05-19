import * as bcrypt from 'bcrypt';
import dataSource from './data-source';
import {
  Cart,
  Category,
  Order,
  OrderItem,
  OrderStatus,
  Payment,
  PaymentStatus,
  Product,
  ProductImage,
  Review,
  User,
  UserRole,
} from './entities';

const image = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

async function run() {
  await dataSource.initialize();
  await dataSource.query(`
    TRUNCATE TABLE
      reviews, payments, order_items, orders, cart_items, carts,
      product_images, products, categories, addresses, users
    RESTART IDENTITY CASCADE
  `);

  const users = dataSource.getRepository(User);
  const carts = dataSource.getRepository(Cart);
  const categories = dataSource.getRepository(Category);
  const products = dataSource.getRepository(Product);
  const orders = dataSource.getRepository(Order);
  const orderItems = dataSource.getRepository(OrderItem);
  const payments = dataSource.getRepository(Payment);
  const reviews = dataSource.getRepository(Review);

  const admin = await users.save({
    fullName: 'ShopNest Admin',
    email: 'admin@shopnest.com',
    passwordHash: await bcrypt.hash('Admin123!', 10),
    role: UserRole.ADMIN,
    phone: '0900000001',
  });

  const customer = await users.save({
    fullName: 'Nguyen Khanh Linh',
    email: 'linh@example.com',
    passwordHash: await bcrypt.hash('Customer123!', 10),
    role: UserRole.CUSTOMER,
    phone: '0900000002',
  });
  await carts.save([{ user: admin }, { user: customer }]);

  const categoryRows = await categories.save([
    {
      name: 'Dien thoai',
      slug: 'dien-thoai',
      description: 'Smartphone moi nhat',
    },
    {
      name: 'Laptop',
      slug: 'laptop',
      description: 'Laptop hoc tap va lam viec',
    },
    {
      name: 'Phu kien',
      slug: 'phu-kien',
      description: 'Tai nghe, sac, ban phim',
    },
  ]);

  const [phones, laptops, accessories] = categoryRows;
  const productRows = await products.save([
    products.create({
      name: 'Galaxy Nova 12',
      slug: 'galaxy-nova-12',
      brand: 'Samsung',
      description: 'Dien thoai AMOLED 120Hz, camera 50MP, pin 5000mAh.',
      price: '12990000',
      stock: 25,
      category: phones,
      images: [{ url: image('galaxy-nova-12'), isPrimary: true } as ProductImage],
    }),
    products.create({
      name: 'iPhone Air 15',
      slug: 'iphone-air-15',
      brand: 'Apple',
      description: 'Smartphone cao cap voi chip nhanh, camera tot va he sinh thai manh.',
      price: '21990000',
      stock: 12,
      category: phones,
      images: [{ url: image('iphone-air-15'), isPrimary: true } as ProductImage],
    }),
    products.create({
      name: 'ThinkBook Pro 14',
      slug: 'thinkbook-pro-14',
      brand: 'Lenovo',
      description: 'Laptop mong nhe cho sinh vien IT, RAM 16GB, SSD 512GB.',
      price: '18990000',
      stock: 9,
      category: laptops,
      images: [{ url: image('thinkbook-pro-14'), isPrimary: true } as ProductImage],
    }),
    products.create({
      name: 'ZenBook Studio 15',
      slug: 'zenbook-studio-15',
      brand: 'Asus',
      description: 'Laptop sang tao noi dung, man hinh dep, hieu nang on dinh.',
      price: '24990000',
      stock: 7,
      category: laptops,
      images: [{ url: image('zenbook-studio-15'), isPrimary: true } as ProductImage],
    }),
    products.create({
      name: 'AirBuds Lite',
      slug: 'airbuds-lite',
      brand: 'SoundMax',
      description: 'Tai nghe bluetooth chong on, hop sac nho gon.',
      price: '990000',
      stock: 48,
      category: accessories,
      images: [{ url: image('airbuds-lite'), isPrimary: true } as ProductImage],
    }),
    products.create({
      name: 'MechKey K87',
      slug: 'mechkey-k87',
      brand: 'KeyLab',
      description: 'Ban phim co TKL, hot-swap, led trang, ket noi USB-C.',
      price: '1590000',
      stock: 6,
      category: accessories,
      images: [{ url: image('mechkey-k87'), isPrimary: true } as ProductImage],
    }),
  ]);

  const order = await orders.save({
    user: customer,
    status: OrderStatus.PAID,
    totalAmount: '13980000',
    shippingAddress: '12 Nguyen Trai, Quan 1, TP HCM',
  });
  await orderItems.save([
    {
      order,
      product: productRows[0],
      quantity: 1,
      unitPrice: productRows[0].price,
    },
    {
      order,
      product: productRows[4],
      quantity: 1,
      unitPrice: productRows[4].price,
    },
  ]);
  await payments.save({
    order,
    provider: 'COD Demo',
    status: PaymentStatus.PAID,
    amount: order.totalAmount,
  });

  await reviews.save([
    {
      user: customer,
      product: productRows[0],
      rating: 5,
      comment: 'May dep, giao nhanh, pin tot.',
    },
    {
      user: customer,
      product: productRows[4],
      rating: 4,
      comment: 'Am thanh on trong tam gia.',
    },
  ]);

  await dataSource.destroy();
  console.log('Seed completed');
}

run().catch(async (error) => {
  console.error(error);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
