import { http } from './client';
import { Cart } from './types';

export const cartApi = {
  async get() {
    const { data } = await http.get<Cart>('/cart');
    return data;
  },

  async addItem(productId: string, quantity = 1) {
    const { data } = await http.post('/cart/items', { productId, quantity });
    return data;
  },

  async removeItem(itemId: string) {
    const { data } = await http.delete(`/cart/items/${itemId}`);
    return data;
  },
};
