export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum BloodGroup {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE'
}

export enum Days {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CHECKED_IN = 'CHECKED_IN',
  IN_CONSULTATION = 'IN_CONSULTATION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  INSURANCE = 'INSURANCE',
  ONLINE = 'ONLINE'
}

// Patient Models
export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  email?: string;
  address?: string;
  bloodGroup?: BloodGroup;
  allergies?: string;
  medicalHistory?: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  email?: string;
  address?: string;
  bloodGroup?: BloodGroup;
  allergies?: string;
  medicalHistory?: string;
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
  day: Days;
  startTime: string;
  endTime: string;
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
}
