import * as bcrypt from 'bcrypt';
import dataSource from './data-source';
import {
  Address,
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
  const addresses = dataSource.getRepository(Address);
  const carts = dataSource.getRepository(Cart);
  const categories = dataSource.getRepository(Category);
  const products = dataSource.getRepository(Product);
  const orders = dataSource.getRepository(Order);
  const orderItems = dataSource.getRepository(OrderItem);
  const payments = dataSource.getRepository(Payment);
  const reviews = dataSource.getRepository(Review);

  await users.save({
    fullName: 'ShopNest Admin',
    email: 'admin@shopnest.com',
    passwordHash: await bcrypt.hash('Admin123!', 10),
    role: UserRole.ADMIN,
    phone: '0900000001',
  });

  const [linh, minh, an] = await users.save([
    {
      fullName: 'Nguyen Khanh Linh',
      email: 'linh@example.com',
      passwordHash: await bcrypt.hash('Customer123!', 10),
      role: UserRole.CUSTOMER,
      phone: '0900000002',
    },
    {
      fullName: 'Tran Duc Minh',
      email: 'minh@example.com',
      passwordHash: await bcrypt.hash('Customer123!', 10),
      role: UserRole.CUSTOMER,
      phone: '0900000003',
    },
    {
      fullName: 'Le Bao An',
      email: 'an@example.com',
      passwordHash: await bcrypt.hash('Customer123!', 10),
      role: UserRole.CUSTOMER,
      phone: '0900000004',
    },
  ]);
  await carts.save([{ user: linh }, { user: minh }, { user: an }]);

  await addresses.save([
    {
      user: linh,
      receiverName: 'Nguyen Khanh Linh',
      phone: '0900000002',
      line1: '12 Nguyen Trai Street',
      district: 'District 1',
      city: 'Ho Chi Minh City',
      isDefault: true,
    },
    {
      user: minh,
      receiverName: 'Tran Duc Minh',
      phone: '0900000003',
      line1: '88 Cach Mang Thang 8',
      district: 'District 3',
      city: 'Ho Chi Minh City',
      isDefault: true,
    },
    {
      user: an,
      receiverName: 'Le Bao An',
      phone: '0900000004',
      line1: '25 Vo Van Ngan',
      district: 'Thu Duc City',
      city: 'Ho Chi Minh City',
      isDefault: true,
    },
  ]);

  const categoryRows = await categories.save([
    {
      name: 'Phones',
      slug: 'phones',
      description: 'Latest smartphones',
    },
    {
      name: 'Laptops',
      slug: 'laptops',
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

  async function createOrder(input: {
    user: User;
    status: OrderStatus;
    provider: string;
    paymentStatus: PaymentStatus;
    shippingAddress: string;
    daysAgo: number;
    items: Array<{ product: Product; quantity: number }>;
  }) {
    const total = input.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    const createdAt = new Date(Date.now() - input.daysAgo * 24 * 60 * 60 * 1000);
    const order = await orders.save({
      user: input.user,
      status: input.status,
      totalAmount: total.toFixed(2),
      shippingAddress: input.shippingAddress,
      createdAt,
    });

    await orderItems.save(
      input.items.map((item) => ({
        order,
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
    );
    await payments.save({
      order,
      provider: input.provider,
      status: input.paymentStatus,
      amount: order.totalAmount,
      createdAt,
    });

    if (input.status !== OrderStatus.CANCELLED) {
      for (const item of input.items) {
        item.product.stock -= item.quantity;
        await products.save(item.product);
      }
    }

    return order;
  }

  await createOrder({
    user: linh,
    status: OrderStatus.PAID,
    provider: 'MOMO',
    paymentStatus: PaymentStatus.PAID,
    shippingAddress:
      'Nguyen Khanh Linh | 0900000002 | 12 Nguyen Trai Street | District 1 | Ho Chi Minh City',
    daysAgo: 1,
    items: [
      { product: productRows[0], quantity: 1 },
      { product: productRows[10], quantity: 1 },
    ],
  });
  await createOrder({
    user: linh,
    status: OrderStatus.SHIPPED,
    provider: 'BANK_TRANSFER',
    paymentStatus: PaymentStatus.PAID,
    shippingAddress:
      'Nguyen Khanh Linh | 0900000002 | 12 Nguyen Trai Street | District 1 | Ho Chi Minh City',
    daysAgo: 9,
    items: [
      { product: productRows[5], quantity: 1 },
      { product: productRows[11], quantity: 1 },
    ],
  });
  await createOrder({
    user: minh,
    status: OrderStatus.PENDING,
    provider: 'COD',
    paymentStatus: PaymentStatus.PENDING,
    shippingAddress:
      'Tran Duc Minh | 0900000003 | 88 Cach Mang Thang 8 | District 3 | Ho Chi Minh City',
    daysAgo: 0,
    items: [
      { product: productRows[1], quantity: 1 },
      { product: productRows[12], quantity: 1 },
    ],
  });
  await createOrder({
    user: minh,
    status: OrderStatus.CANCELLED,
    provider: 'MOMO',
    paymentStatus: PaymentStatus.FAILED,
    shippingAddress:
      'Tran Duc Minh | 0900000003 | 88 Cach Mang Thang 8 | District 3 | Ho Chi Minh City',
    daysAgo: 16,
    items: [{ product: productRows[8], quantity: 1 }],
  });
  await createOrder({
    user: an,
    status: OrderStatus.PAID,
    provider: 'BANK_TRANSFER',
    paymentStatus: PaymentStatus.PAID,
    shippingAddress: 'Le Bao An | 0900000004 | 25 Vo Van Ngan | Thu Duc City | Ho Chi Minh City',
    daysAgo: 3,
    items: [
      { product: productRows[2], quantity: 1 },
      { product: productRows[13], quantity: 2 },
      { product: productRows[14], quantity: 1 },
    ],
  });

  await reviews.save([
    {
      user: linh,
      product: productRows[0],
      rating: 5,
      comment: 'Beautiful phone, fast delivery, and great battery life.',
    },
    {
      user: minh,
      product: productRows[1],
      rating: 5,
      comment: 'Premium build and the camera is excellent.',
    },
    {
      user: an,
      product: productRows[13],
      rating: 4,
      comment: 'Comfortable mouse for long study sessions.',
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
