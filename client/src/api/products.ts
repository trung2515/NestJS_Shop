import { http } from './client';
import { Category, Product } from './types';

export type ProductFilters = {
  q?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'stock_asc';
};

export type ProductPayload = {
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrls?: string[];
  isActive?: boolean;
};

export const productsApi = {
  async list(filters: ProductFilters = {}) {
    const { data } = await http.get<Product[]>('/products', {
      params: {
        q: filters.q || undefined,
        categoryId: filters.categoryId || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        sort: filters.sort || undefined,
      },
    });
    return data;
  },

  async get(id: string) {
    const { data } = await http.get<Product>(`/products/${id}`);
    return data;
  },

  async categories() {
    const { data } = await http.get<Category[]>('/categories');
    return data;
  },

  async create(payload: ProductPayload) {
    const { data } = await http.post<Product>('/products', payload);
    return data;
  },

  async update(id: string, payload: ProductPayload) {
    const { data } = await http.patch<Product>(`/products/${id}`, payload);
    return data;
  },

  async remove(id: string) {
    const { data } = await http.delete<Product>(`/products/${id}`);
    return data;
  },
};
