import { apiClient } from './client';
import type { 
  ApiResponse, 
  PagedResponse,
  Invoice, 
  CreateInvoiceRequest,
  RecordPaymentRequest,
  Payment
} from '../types';

export const billingApi = {
  createInvoice: async (data: CreateInvoiceRequest): Promise<Invoice> => {
    const response = await apiClient.post<ApiResponse<Invoice>>(`/invoices`, data);
    return response.data.data;
  },

  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${id}`);
    return response.data.data;
  },

  getInvoicesByPatient: async (patientId: string, page = 0, size = 10): Promise<PagedResponse<Invoice>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Invoice>>>(`/invoices/patient/${patientId}`, {
      params: { page, size }
    });
    return response.data.data;
  },

  recordPayment: async (invoiceId: string, data: RecordPaymentRequest): Promise<Payment> => {
    const response = await apiClient.post<ApiResponse<Payment>>(`/invoices/${invoiceId}/payments`, data);
    return response.data.data;
  },

  downloadReceipt: async (paymentId: string): Promise<Blob> => {
    const response = await apiClient.get(`/invoices/payments/${paymentId}/receipt`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
