import { http } from './client';
import { Category, Product } from './types';

export type ProductFilters = {
  q?: string;
  categoryId?: string;
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
};
