import { apiClient } from './client';
import type { 
  ApiResponse, 
  PagedResponse, 
  Department, 
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  Specialization,
  CreateSpecializationRequest
} from '../types';

export const departmentApi = {
  getDepartments: async (pageNo = 0, pageSize = 20): Promise<PagedResponse<Department>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Department>>>(`/departments`, {
      params: { pageNo, pageSize }
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

  updateDepartment: async (data: UpdateDepartmentRequest): Promise<Department> => {
    const response = await apiClient.put<ApiResponse<Department>>(`/departments`, data);
    return response.data.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient.delete(`/departments/${id}`);
  },

  // Specializations API
  getSpecializations: async (): Promise<Specialization[]> => {
    const response = await apiClient.get<ApiResponse<Specialization[]>>(`/specializations`);
    return response.data.data;
  },

  getSpecializationById: async (id: string): Promise<Specialization> => {
    const response = await apiClient.get<ApiResponse<Specialization>>(`/specializations/${id}`);
    return response.data.data;
  },

  createSpecialization: async (data: CreateSpecializationRequest): Promise<Specialization> => {
    const response = await apiClient.post<ApiResponse<Specialization>>(`/specializations`, data);
    return response.data.data;
  },

  deleteSpecialization: async (id: string): Promise<void> => {
    await apiClient.delete(`/specializations/${id}`);
  },

  // HOD Management API
  assignHod: async (departmentId: string, doctorId: string): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(`/departments/hod`, { departmentId, doctorId });
    return response.data.data;
  },

  replaceHod: async (departmentId: string, doctorId: string): Promise<any> => {
    const response = await apiClient.patch<ApiResponse<any>>(`/departments/hod`, { departmentId, doctorId });
    return response.data.data;
  },

  removeHod: async (departmentId: string): Promise<any> => {
    const response = await apiClient.delete<ApiResponse<any>>(`/departments/hod`, { data: { departmentId } });
    return response.data.data;
  }
};
