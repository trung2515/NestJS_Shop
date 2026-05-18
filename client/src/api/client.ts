import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export type Product = {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  stock: number;
  category: { id: string; name: string };
  images?: { id: string; url: string; isPrimary: boolean }[];
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
