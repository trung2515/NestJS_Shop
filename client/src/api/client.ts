import axios from 'axios';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const REFRESH_TOKEN_EXPIRES_AT_KEY = 'refreshTokenExpiresAt';
const USER_KEY = 'user';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(' ');
    if (message) return message;
  }

  return fallback;
}

export function clearStoredAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isStoredSessionExpired() {
  const expiresAt = Number(localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY) ?? 0);
  return !expiresAt || Date.now() >= expiresAt;
}

export function storeAuth(auth: {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  user: unknown;
}) {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, String(auth.refreshTokenExpiresAt));
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4001',
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshRequest: Promise<string | null> | null = null;

async function refreshAccessToken() {
  if (isStoredSessionExpired()) {
    clearStoredAuth();
    return null;
  }

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  if (!refreshRequest) {
    refreshRequest = axios
      .post<{
        accessToken: string;
        refreshToken: string;
        refreshTokenExpiresAt: number;
        user: unknown;
      }>(`${http.defaults.baseURL}/auth/refresh`, { refreshToken })
      .then(({ data }) => {
        storeAuth(data);
        return data.accessToken;
      })
      .catch(() => {
        clearStoredAuth();
        return null;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error);
    }

    const config = error.config as typeof error.config & { _retry?: boolean };
    if (
      config._retry ||
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/refresh')
    ) {
      clearStoredAuth();
      return Promise.reject(error);
    }

    config._retry = true;
    const accessToken = await refreshAccessToken();
    if (!accessToken) {
      if (window.location.pathname !== '/login') window.location.assign('/login');
      return Promise.reject(error);
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return http(config);
  },
);
