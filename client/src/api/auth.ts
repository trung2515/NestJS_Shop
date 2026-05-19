import { http } from './client';
import { AuthResponse } from './types';

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await http.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },
};
