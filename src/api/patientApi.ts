import { apiClient } from './client';
import type { ApiResponse, PagedResponse, Patient, CreatePatientRequest } from '../types';

export const patientApi = {
  getAllPatients: async (
    page = 0, 
    size = 10, 
    patientNumber?: string, 
    fullName?: string, 
    phoneNumber?: string, 
    gender?: string, 
    bloodGroup?: string
  ): Promise<PagedResponse<Patient>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Patient>>>(`/patients`, {
      params: { page, size, patientNumber, fullName, phoneNumber, gender, bloodGroup }
    });
    return response.data.data;
  },

  getPatientById: async (id: string): Promise<Patient> => {
    const response = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data;
  },

  createPatient: async (data: CreatePatientRequest): Promise<Patient> => {
    const response = await apiClient.post<ApiResponse<Patient>>(`/patients`, data);
    return response.data.data;
  },

  updatePatient: async (id: string, data: CreatePatientRequest): Promise<Patient> => {
    const response = await apiClient.put<ApiResponse<Patient>>(`/patients/${id}`, data);
    return response.data.data;
  },

  deletePatient: async (id: string): Promise<void> => {
    await apiClient.delete(`/patients/${id}`);
  }
};
