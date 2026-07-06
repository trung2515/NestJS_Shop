import { http } from './client';
import { AuthResponse } from './types';

export const authApi = {
  async register(fullName: string, email: string, password: string) {
    const { data } = await http.post<AuthResponse>('/auth/register', {
      fullName,
      email,
      password,
    });
    return data;
  },

  async login(email: string, password: string) {
    const { data } = await http.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  async refresh(refreshToken: string) {
    const { data } = await http.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  },
};
