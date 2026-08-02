import { apiClient } from './client';
import type { 
  ApiResponse, 
  PagedResponse, 
  Department, 
  CreateDepartmentRequest,
  Specialization,
  CreateSpecializationRequest
} from '../types';

export const departmentApi = {
  getDepartments: async (page = 0, size = 20): Promise<PagedResponse<Department>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Department>>>(`/departments`, {
      params: { page, size }
    });
    return response.data.data;
  },

  getDepartmentById: async (id: string): Promise<Department> => {
    const response = await apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
    return response.data.data;
  },

  createDepartment: async (data: CreateDepartmentRequest): Promise<Department> => {
    const response = await apiClient.post<ApiResponse<Department>>(`/departments`, data);
    return response.data.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient.delete(`/departments/${id}`);
  },

  // Specializations
  getSpecializations: async (): Promise<Specialization[]> => {
    const response = await apiClient.get<ApiResponse<Specialization[]>>(`/specializations`);
    return response.data.data;
  },

  createSpecialization: async (data: CreateSpecializationRequest): Promise<Specialization> => {
    const response = await apiClient.post<ApiResponse<Specialization>>(`/specializations`, data);
    return response.data.data;
  },

  deleteSpecialization: async (id: string): Promise<void> => {
    await apiClient.delete(`/specializations/${id}`);
  }
};
