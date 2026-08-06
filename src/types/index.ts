export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PagedResponse<T> {
  content: T[];
  page?: number;
  size?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements: number;
  totalPages: number;
  last?: boolean;
  first?: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
  number?: number;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export const Gender = {
  MALE: 'MALE' as Gender,
  FEMALE: 'FEMALE' as Gender,
  OTHER: 'OTHER' as Gender
} as const;

export type BloodGroup = 
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE';
export const BloodGroup = {
  A_POSITIVE: 'A_POSITIVE' as BloodGroup,
  A_NEGATIVE: 'A_NEGATIVE' as BloodGroup,
  B_POSITIVE: 'B_POSITIVE' as BloodGroup,
  B_NEGATIVE: 'B_NEGATIVE' as BloodGroup,
  AB_POSITIVE: 'AB_POSITIVE' as BloodGroup,
  AB_NEGATIVE: 'AB_NEGATIVE' as BloodGroup,
  O_POSITIVE: 'O_POSITIVE' as BloodGroup,
  O_NEGATIVE: 'O_NEGATIVE' as BloodGroup
} as const;

export type Days = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export const Days = {
  MONDAY: 'MONDAY' as Days,
  TUESDAY: 'TUESDAY' as Days,
  WEDNESDAY: 'WEDNESDAY' as Days,
  THURSDAY: 'THURSDAY' as Days,
  FRIDAY: 'FRIDAY' as Days,
  SATURDAY: 'SATURDAY' as Days,
  SUNDAY: 'SUNDAY' as Days
} as const;

export type AppointmentStatus = 'SCHEDULED' | 'CHECKED_IN' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'BOOKED' | 'CONSULTING' | 'NO_SHOW';
export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED' as AppointmentStatus,
  CHECKED_IN: 'CHECKED_IN' as AppointmentStatus,
  IN_CONSULTATION: 'IN_CONSULTATION' as AppointmentStatus,
  COMPLETED: 'COMPLETED' as AppointmentStatus,
  CANCELLED: 'CANCELLED' as AppointmentStatus,
  BOOKED: 'BOOKED' as AppointmentStatus,
  CONSULTING: 'CONSULTING' as AppointmentStatus,
  NO_SHOW: 'NO_SHOW' as AppointmentStatus
} as const;

export type InvoiceStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';
export const InvoiceStatus = {
  PENDING: 'PENDING' as InvoiceStatus,
  PARTIALLY_PAID: 'PARTIALLY_PAID' as InvoiceStatus,
  PAID: 'PAID' as InvoiceStatus,
  CANCELLED: 'CANCELLED' as InvoiceStatus
} as const;

export type PaymentMethod = 'CASH' | 'CARD' | 'INSURANCE' | 'ONLINE';
export const PaymentMethod = {
  CASH: 'CASH' as PaymentMethod,
  CARD: 'CARD' as PaymentMethod,
  INSURANCE: 'INSURANCE' as PaymentMethod,
  ONLINE: 'ONLINE' as PaymentMethod
} as const;

// Patient Models
export interface Patient {
  id?: string;
  patientNumber: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  email: string;
  address: string;
  bloodGroup: BloodGroup;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  allergies?: string;
  medicalHistory?: string;
}

export interface CreatePatientRequest {
  patientNumber: string;
  fullName: string;
  address: string;
  dateOfBirth: string; // Format: dd-MM-yyyy
  gender: Gender;
  bloodGroup: BloodGroup;
  phoneNumber: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  medicalHistory?: string;
  allergies?: string;
}

// Doctor Models
export interface Doctor {
  id?: string;
  name: string;
  email: string;
  username: string;
  address?: string;
  phoneNumber: string;
  gender: Gender;
  consultationFee: number;
  licenseNumber: string;
  specialization?: string;
  department?: string;
}

export interface CreateDoctorRequest {
  name: string;
  email: string;
  username: string;
  password?: string;
  address?: string;
  phoneNumber: string;
  gender: Gender;
  consultationFee: number;
  licenseNumber: string;
  specializationId?: string;
  departmentId?: string;
}

export interface UpdateDoctorRequest extends Partial<CreateDoctorRequest> {
  id: string;
  doctorId?: string;
}

// Schedule Models
export interface DoctorSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  department?: string;
  specialization?: string;
  day: Days;
  startTime: string;
  endTime: string;
}

export interface CreateDoctorScheduleRequest {
  doctorId: string;
  dayOfWeek: Days;
  startTime: string;
  endTime: string;
}

export interface UpdateDoctorScheduleRequest {
  scheduleId: string;
  dayOfWeek?: Days;
  startTime?: string;
  endTime?: string;
}

export interface FilterDoctorScheduleRequest {
  day?: Days;
  doctorId?: string;
  departmentId?: string;
  specializationId?: string;
  doctorName?: string;
  availableAt?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

// Department & Specialization Models
export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  departmentId: string;
  name?: string;
  description?: string;
}

export interface Specialization {
  id: string;
  name: string;
}


export interface CreateSpecializationRequest {
  name: string;
}


// Appointment Models
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  departmentId?: string;
  department?: string;
  appointmentTime: string;
  appointmentDate: string;
  reason?: string;
  allergies?: string;
  appointmentStatus: AppointmentStatus;
  bookedBy?: string;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
}

export interface RescheduleAppointmentRequest {
  appointmentDate: string;
  appointmentTime: string;
}

// Consultation Models
export interface Consultation {
  id: string;
  appointmentId: string;
  symptoms: string;
  diagnosis: string;
  clinicalNotes: string;
  followUpDate?: string;
}

export interface CreateConsultationRequest {
  symptoms: string;
  diagnosis: string;
  clinicalNotes: string;
  followUpDate?: string;
}

// Prescription Models
export interface PrescriptionItem {
  id?: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  consultationId: string;
  items: PrescriptionItem[];
}

export interface CreatePrescriptionRequest {
  items: PrescriptionItem[];
}

// Billing & Invoice Models
export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName?: string;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  amountPaid: number;
  balanceDue: number;
  totalAmount: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
  createdAt: string;
}

export interface CreateInvoiceRequest {
  patientId: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  discountAmount?: number;
  taxAmount?: number;
}

export interface RecordPaymentRequest {
  amountPaid: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  transactionReference?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  paidAt: string;
}

// Staff Models
export interface Staff {
  id: string;
  name: string;
  email: string;
  username: string;
  address?: string;
  phoneNumber: string;
  gender: Gender;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  username: string;
  password?: string;
  address?: string;
  phoneNumber: string;
  gender: Gender;
  role?: string;
}

export interface UpdateStaffRequest {
  staffId: string;
  name?: string;
  address?: string;
  phoneNumber?: string;
}

