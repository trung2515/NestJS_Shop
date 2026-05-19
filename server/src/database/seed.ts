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

const productImage = (url: string) => ({ url, isPrimary: true }) as ProductImage;

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

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
      name: 'Phones',
      slug: 'phones',
      description: 'Latest smartphones',
    },
    {
      name: 'Laptop',
      slug: 'laptop',
      description: 'Laptops for study and work',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Headphones, chargers, and keyboards',
    },
  ]);

  const [phones, laptops, accessories] = categoryRows;
  const productRows = await products.save([
    products.create({
      name: 'Galaxy Nova 12',
      slug: 'galaxy-nova-12',
      brand: 'Samsung',
      description: 'AMOLED 120Hz smartphone with a 50MP camera and 5000mAh battery.',
      price: '12990000',
      stock: 25,
      category: phones,
      images: [productImage(img('photo-1592899677977-9c10ca588bbd'))],
    }),
    products.create({
      name: 'iPhone Air 15',
      slug: 'iphone-air-15',
      brand: 'Apple',
      description: 'Premium smartphone with a fast chip, strong camera, and rich ecosystem.',
      price: '21990000',
      stock: 12,
      category: phones,
      images: [productImage(img('photo-1510557880182-3d4d3cba35a5'))],
    }),
    products.create({
      name: 'Pixel Vision 8',
      slug: 'pixel-vision-8',
      brand: 'Google',
      description: 'AI-first Android phone with clean software and dependable night photos.',
      price: '16990000',
      stock: 18,
      category: phones,
      images: [productImage(img('photo-1611791484670-ce19b801d192'))],
    }),
    products.create({
      name: 'Xiaomi Redmi Turbo',
      slug: 'xiaomi-redmi-turbo',
      brand: 'Xiaomi',
      description: 'Value smartphone with fast charging, large display, and smooth performance.',
      price: '7490000',
      stock: 34,
      category: phones,
      images: [productImage(img('photo-1601784551446-20c9e07cdbdb'))],
    }),
    products.create({
      name: 'Oppo Reno Glow',
      slug: 'oppo-reno-glow',
      brand: 'Oppo',
      description: 'Slim phone focused on portrait photography and long battery life.',
      price: '8990000',
      stock: 21,
      category: phones,
      images: [productImage(img('photo-1511707171634-5f897ff02aa9'))],
    }),
    products.create({
      name: 'ThinkBook Pro 14',
      slug: 'thinkbook-pro-14',
      brand: 'Lenovo',
      description: 'Slim laptop for IT students with 16GB RAM and a 512GB SSD.',
      price: '18990000',
      stock: 9,
      category: laptops,
      images: [productImage(img('photo-1496181133206-80ce9b88a853'))],
    }),
    products.create({
      name: 'ZenBook Studio 15',
      slug: 'zenbook-studio-15',
      brand: 'Asus',
      description: 'Creator laptop with a sharp display and stable performance.',
      price: '24990000',
      stock: 7,
      category: laptops,
      images: [productImage(img('photo-1541807084-5c52b6b3adef'))],
    }),
    products.create({
      name: 'MacBook Air M3 13',
      slug: 'macbook-air-m3-13',
      brand: 'Apple',
      description: 'Lightweight laptop with all-day battery life and a quiet fanless design.',
      price: '27990000',
      stock: 11,
      category: laptops,
      images: [productImage(img('photo-1517336714731-489689fd1ca8'))],
    }),
    products.create({
      name: 'Dell XPS 13 Plus',
      slug: 'dell-xps-13-plus',
      brand: 'Dell',
      description: 'Compact premium ultrabook with a bright display and strong build quality.',
      price: '32990000',
      stock: 8,
      category: laptops,
      images: [productImage(img('photo-1593642632823-8f785ba67e45'))],
    }),
    products.create({
      name: 'ROG Strix G16',
      slug: 'rog-strix-g16',
      brand: 'Asus',
      description: 'Gaming laptop with high-refresh display, RGB keyboard, and RTX graphics.',
      price: '38990000',
      stock: 5,
      category: laptops,
      images: [productImage(img('photo-1603302576837-37561b2e2302'))],
    }),
    products.create({
      name: 'AirBuds Lite',
      slug: 'airbuds-lite',
      brand: 'SoundMax',
      description: 'Bluetooth earbuds with noise reduction and a compact charging case.',
      price: '990000',
      stock: 48,
      category: accessories,
      images: [productImage(img('photo-1606220945770-b5b6c2c55bf1'))],
    }),
    products.create({
      name: 'MechKey K87',
      slug: 'mechkey-k87',
      brand: 'KeyLab',
      description: 'TKL mechanical keyboard with hot-swap switches, white LED, and USB-C.',
      price: '1590000',
      stock: 6,
      category: accessories,
      images: [productImage(img('photo-1587829741301-dc798b83add3'))],
    }),
    products.create({
      name: 'Studio Headphones Pro',
      slug: 'studio-headphones-pro',
      brand: 'SoundMax',
      description: 'Over-ear headphones with soft cushions and deep bass for focused work.',
      price: '2490000',
      stock: 19,
      category: accessories,
      images: [productImage(img('photo-1505740420928-5e560c06d30e'))],
    }),
    products.create({
      name: 'Ergo Mouse M2',
      slug: 'ergo-mouse-m2',
      brand: 'LogiTech',
      description: 'Wireless ergonomic mouse with silent clicks and adjustable DPI.',
      price: '690000',
      stock: 42,
      category: accessories,
      images: [productImage(img('photo-1527814050087-3793815479db'))],
    }),
    products.create({
      name: 'USB-C GaN Charger 65W',
      slug: 'usb-c-gan-charger-65w',
      brand: 'Anker',
      description: 'Compact fast charger for phones, tablets, and ultrabooks.',
      price: '890000',
      stock: 30,
      category: accessories,
      images: [productImage(img('photo-1621972750749-0fbb1abb7736'))],
    }),
    products.create({
      name: '4K Webcam ClearView',
      slug: '4k-webcam-clearview',
      brand: 'AverMedia',
      description: 'Sharp webcam with autofocus and clear video calls for hybrid work.',
      price: '1790000',
      stock: 14,
      category: accessories,
      images: [productImage(img('photo-1587826080692-f439cd0b70da'))],
    }),
  ]);

  const order = await orders.save({
    user: customer,
    status: OrderStatus.PAID,
    totalAmount: '13980000',
    shippingAddress: '12 Nguyen Trai Street, District 1, Ho Chi Minh City',
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
      comment: 'Beautiful phone, fast delivery, and great battery life.',
    },
    {
      user: customer,
      product: productRows[4],
      rating: 4,
      comment: 'Good sound quality for the price.',
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
