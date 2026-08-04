export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR' | 'PATIENT';

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: Role;
  phoneNumber?: string;
  gender?: string;
  staffId?: string;
}

export interface UserProfileUpdate {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

