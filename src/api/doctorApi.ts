import { apiClient } from './client';
import type { 
  ApiResponse, 
  PagedResponse, 
  Doctor, 
  CreateDoctorRequest, 
  UpdateDoctorRequest,
  DoctorSchedule,
  CreateDoctorScheduleRequest
} from '../types';

export const doctorApi = {
  getDoctors: async (page = 0, size = 10, departmentId?: string, specializationId?: string): Promise<PagedResponse<Doctor>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Doctor>>>(`/doctors`, {
      params: { page, size, departmentId, specializationId }
    });
    return response.data.data;
  },

  getDoctorById: async (id: string): Promise<Doctor> => {
    const response = await apiClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return response.data.data;
  },

  createDoctor: async (data: CreateDoctorRequest): Promise<Doctor> => {
    const response = await apiClient.post<ApiResponse<Doctor>>(`/doctors`, data);
    return response.data.data;
  },

  updateDoctor: async (data: UpdateDoctorRequest): Promise<Doctor> => {
    const response = await apiClient.put<ApiResponse<Doctor>>(`/doctors`, data);
    return response.data.data;
  },

  deleteDoctor: async (id: string): Promise<void> => {
    await apiClient.delete(`/doctors/${id}`);
  },

  // Schedules
  getSchedules: async (doctorId?: string, day?: string, page = 0, size = 10): Promise<PagedResponse<DoctorSchedule>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<DoctorSchedule>>>(`/doctor-schedules`, {
      params: { doctorId, day, page, size }
    });
    return response.data.data;
  },

  createSchedule: async (data: CreateDoctorScheduleRequest): Promise<DoctorSchedule> => {
    const response = await apiClient.post<ApiResponse<DoctorSchedule>>(`/doctor-schedules`, data);
    return response.data.data;
  },

  deleteSchedule: async (id: string): Promise<void> => {
    await apiClient.delete(`/doctor-schedules/${id}`);
  },

  getMyTodayAppointments: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/v1/doctors/me/appointments/today`);
    return response.data.data;
  }
};
