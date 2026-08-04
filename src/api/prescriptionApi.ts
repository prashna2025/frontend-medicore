import { apiClient } from './client';
import type { 
  ApiResponse, 
  Prescription, 
  CreatePrescriptionRequest
} from '../types';

export const prescriptionApi = {
  createPrescription: async (consultationId: string, data: CreatePrescriptionRequest): Promise<Prescription> => {
    const response = await apiClient.post<ApiResponse<Prescription>>(`/v1/consultations/${consultationId}/prescriptions`, data);
    return response.data.data;
  },

  getPrescriptionById: async (id: string): Promise<Prescription> => {
    const response = await apiClient.get<ApiResponse<Prescription>>(`/v1/prescriptions/${id}`);
    return response.data.data;
  },

  updatePrescription: async (id: string, data: CreatePrescriptionRequest): Promise<Prescription> => {
    const response = await apiClient.put<ApiResponse<Prescription>>(`/v1/prescriptions/${id}`, data);
    return response.data.data;
  },

  deletePrescription: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/prescriptions/${id}`);
  }
};
