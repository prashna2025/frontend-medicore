import { apiClient } from '../api/client';

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data.data || response.data;
  },

  updateProfile: async (data: { name: string; email: string }) => {
    const response = await apiClient.put('/users/profile', data);
    return response.data.data || response.data;
  }
};
