import { apiClient } from './client';
import type { 
  ApiResponse, 
  PagedResponse, 
  Doctor, 
  CreateDoctorRequest, 
  UpdateDoctorRequest,
  DoctorSchedule,
  CreateDoctorScheduleRequest,
  UpdateDoctorScheduleRequest,
  FilterDoctorScheduleRequest
} from '../types';

export const doctorApi = {
  getDoctors: async (pageNo = 0, pageSize = 10, departmentId?: string, specializationId?: string, searchKeyword?: string): Promise<PagedResponse<Doctor>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Doctor>>>(`/doctors`, {
      params: { pageNo, pageSize, departmentId, specializationId, searchKeyword }
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

  updateDoctor: async (data: UpdateDoctorRequest & { id?: string }): Promise<Doctor> => {
    const payload = {
      doctorId: data.doctorId || data.id,
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      consultationFee: data.consultationFee,
      departmentId: data.departmentId || null,
      specializationId: data.specializationId || null
    };
    const response = await apiClient.put<ApiResponse<Doctor>>(`/doctors`, payload);
    return response.data.data;
  },

  deleteDoctor: async (id: string): Promise<void> => {
    await apiClient.delete(`/doctors/${id}`);
  },

  // Schedules API
  getSchedules: async (
    filter?: FilterDoctorScheduleRequest | { doctorId?: string; day?: string; page?: number; size?: number }
  ): Promise<PagedResponse<DoctorSchedule>> => {
    const params: Record<string, any> = {};
    if (filter) {
      if ('pageNo' in filter || 'pageSize' in filter) {
        Object.assign(params, filter);
      } else {
        const { doctorId, day, page, size, ...rest } = filter as any;
        if (doctorId) params.doctorId = doctorId;
        if (day) params.day = day;
        if (page !== undefined) params.pageNo = page;
        if (size !== undefined) params.pageSize = size;
        Object.assign(params, rest);
      }
    }
    const response = await apiClient.get<ApiResponse<PagedResponse<DoctorSchedule>>>(`/doctor-schedules`, {
      params
    });
    return response.data.data;
  },

  getScheduleById: async (id: string): Promise<DoctorSchedule> => {
    const response = await apiClient.get<ApiResponse<DoctorSchedule>>(`/doctor-schedules/${id}`);
    return response.data.data;
  },

  createSchedule: async (data: CreateDoctorScheduleRequest): Promise<DoctorSchedule> => {
    const response = await apiClient.post<ApiResponse<DoctorSchedule>>(`/doctor-schedules`, data);
    return response.data.data;
  },

  updateSchedule: async (data: UpdateDoctorScheduleRequest): Promise<DoctorSchedule> => {
    const response = await apiClient.put<ApiResponse<DoctorSchedule>>(`/doctor-schedules`, data);
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

