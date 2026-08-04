import { TOKEN_KEY, USER_KEY } from '../constants';
import type { User } from '../types/user';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('medicore_token');
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('medicore_token', token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('medicore_token');
};

export const getStoredUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY) || localStorage.getItem('medicore_user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem('medicore_user', JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('medicore_user');
};
