import { http } from './client';
import { Category, Product } from './types';

export type ProductFilters = {
  q?: string;
  categoryId?: string;
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
      },
    });
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
