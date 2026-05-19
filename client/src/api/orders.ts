import { http } from './client';
import { CheckoutPayload, Order } from './types';

export const ordersApi = {
  async list() {
    const { data } = await http.get<Order[]>('/orders');
    return data;
  },

  async checkout(payload: CheckoutPayload) {
    const { data } = await http.post<Order>('/orders/checkout', payload);
    return data;
  },
};
