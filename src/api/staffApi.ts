import { apiClient } from './client';
import type { 
  ApiResponse, 
  PagedResponse, 
  Staff, 
  CreateStaffRequest
} from '../types';

export const staffApi = {
  getStaffs: async (page = 0, size = 10): Promise<PagedResponse<Staff>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Staff>>>(`/staffs`, {
      params: { page, size }
    });
    return response.data.data;
  },

  getStaffById: async (id: string): Promise<Staff> => {
    const response = await apiClient.get<ApiResponse<Staff>>(`/staffs/${id}`);
    return response.data.data;
  },

  createStaff: async (data: CreateStaffRequest): Promise<Staff> => {
    const response = await apiClient.post<ApiResponse<Staff>>(`/staffs`, data);
    return response.data.data;
  },

  updateStaff: async (data: Partial<CreateStaffRequest> & { id: string }): Promise<Staff> => {
    const response = await apiClient.put<ApiResponse<Staff>>(`/staffs`, data);
    return response.data.data;
  },

  deleteStaff: async (id: string): Promise<void> => {
    await apiClient.delete(`/staffs/${id}`);
  }
};
