import { http } from './client';
import { ReportRow } from './types';

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
};
