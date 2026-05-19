export type Product = {
  id: string;
  name: string;
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
  shippingAddress: string;
  paymentProvider: string;
};

export type ReportRow = Record<string, string | number>;
