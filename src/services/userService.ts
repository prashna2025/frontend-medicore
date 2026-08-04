import { api } from './api';
import type { User, UserProfileUpdate } from '../types/user';

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data.data || response.data;
  },

  updateProfile: async (data: UserProfileUpdate): Promise<User> => {
    const response = await api.put('/users/profile', data);
    return response.data.data || response.data;
  }
};
