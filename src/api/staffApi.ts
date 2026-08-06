import { apiClient } from './client';
import type { 
  ApiResponse, 
  PagedResponse, 
  Staff, 
  CreateStaffRequest,
  UpdateStaffRequest
} from '../types';

export const staffApi = {
  getStaffs: async (pageNo = 0, pageSize = 10): Promise<PagedResponse<Staff>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Staff>>>(`/staffs`, {
      params: { pageNo, pageSize }
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

  updateStaff: async (data: UpdateStaffRequest | ({ id: string; name?: string; address?: string; phoneNumber?: string })): Promise<Staff> => {
    const payload = {
      staffId: 'staffId' in data ? data.staffId : data.id,
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber
    };
    const response = await apiClient.put<ApiResponse<Staff>>(`/staffs`, payload);
    return response.data.data;
  },

  deleteStaff: async (id: string): Promise<void> => {
    await apiClient.delete(`/staffs/${id}`);
  }
};
