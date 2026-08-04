import { api } from './api';
import type { User } from '../types/user';
import type { LoginResponse, RegisterResponse } from '../types/auth';

export interface LoginDto {
  email: string;
  password?: string;
  username?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password?: string;
  username?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password?: string;
}

export const authService = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data.data || response.data;
  },

  register: async (userData: RegisterDto): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data.data || response.data;
  },

  forgotPassword: async (data: ForgotPasswordDto): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordDto): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data || response.data;
  }
};
