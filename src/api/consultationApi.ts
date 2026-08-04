import { apiClient } from './client';
import type { 
  ApiResponse, 
  Consultation, 
  CreateConsultationRequest
} from '../types';

export const consultationApi = {
  startConsultation: async (appointmentId: string, data: CreateConsultationRequest): Promise<Consultation> => {
    const response = await apiClient.post<ApiResponse<Consultation>>(`/v1/appointments/${appointmentId}/consultation`, data);
    return response.data.data;
  },

  getConsultationById: async (id: string): Promise<Consultation> => {
    const response = await apiClient.get<ApiResponse<Consultation>>(`/v1/consultations/${id}`);
    return response.data.data;
  },

  updateConsultation: async (id: string, data: CreateConsultationRequest): Promise<Consultation> => {
    const response = await apiClient.put<ApiResponse<Consultation>>(`/v1/consultations/${id}`, data);
    return response.data.data;
  },

  completeConsultation: async (id: string): Promise<Consultation> => {
    const response = await apiClient.patch<ApiResponse<Consultation>>(`/v1/consultations/${id}/complete`);
    return response.data.data;
  }
};
