export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: string;
  stock: number;
  category: { id: string; name: string };
  images?: ProductImage[];
};

export type ProductImage = {
  id: string;
  url: string;
  isPrimary: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  user: AuthUser;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

export type Cart = {
  id: string;
  items?: CartItem[];
};

export type CheckoutPayload = {
  receiverName: string;
  phone: string;
  line1: string;
  district: string;
  city: string;
  paymentProvider: string;
};

export type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: string;
  product: Product;
};

export type Payment = {
  id: string;
  provider: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  amount: string;
  createdAt: string;
};

export type Order = {
  id: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';
  totalAmount: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
  payment?: Payment;
};

export type AdminOrder = Order & {
  user: AuthUser;
};

export type ReportRow = Record<string, string | number>;
