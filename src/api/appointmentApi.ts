import { apiClient } from './client';
import type { 
  ApiResponse, 
  Appointment, 
  CreateAppointmentRequest,
  RescheduleAppointmentRequest
} from '../types';

export const appointmentApi = {
  getTodayAppointments: async (): Promise<Appointment[]> => {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(`/v1/appointments/today`);
    return response.data.data;
  },

  getAppointmentsByDate: async (date: string): Promise<Appointment[]> => {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(`/v1/appointments`, {
      params: { date }
    });
    return response.data.data;
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get<ApiResponse<Appointment>>(`/v1/appointments/${id}`);
    return response.data.data;
  },

  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<ApiResponse<Appointment>>(`/v1/appointments`, data);
    return response.data.data;
  },

  checkInAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiClient.patch<ApiResponse<Appointment>>(`/v1/appointments/${id}/check-in`);
    return response.data.data;
  },

  cancelAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiClient.patch<ApiResponse<Appointment>>(`/v1/appointments/${id}/cancel`);
    return response.data.data;
  },

  rescheduleAppointment: async (id: string, data: RescheduleAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.patch<ApiResponse<Appointment>>(`/v1/appointments/${id}/reschedule`, data);
    return response.data.data;
  }
};
