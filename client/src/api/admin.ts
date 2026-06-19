import { http } from './client';
import { AdminOrder, Order, ReportRow } from './types';

export const adminApi = {
  async salesReport() {
    const { data } = await http.get<ReportRow[]>('/admin/reports/sales');
    return data;
  },

  async topProducts() {
    const { data } = await http.get<ReportRow[]>('/admin/reports/top-products');
    return data;
  },

  async lowStock() {
    const { data } = await http.get<ReportRow[]>('/admin/reports/low-stock');
    return data;
  },

  async orders() {
    const { data } = await http.get<AdminOrder[]>('/admin/orders');
    return data;
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    const { data } = await http.patch<AdminOrder>(`/admin/orders/${id}/status`, { status });
    return data;
  },
};
