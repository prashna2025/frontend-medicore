import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

import PatientList from '../pages/Patients/PatientList';
import PatientForm from '../pages/Patients/PatientForm';
import PatientDetails from '../pages/Patients/PatientDetails';
import DoctorList from '../pages/Doctors/DoctorList';
import DoctorForm from '../pages/Doctors/DoctorForm';
import DoctorSchedules from '../pages/Doctors/DoctorSchedules';
import DepartmentList from '../pages/Departments/DepartmentList';
import AppointmentList from '../pages/Appointments/AppointmentList';
import AppointmentForm from '../pages/Appointments/AppointmentForm';
import ConsultationList from '../pages/Consultations/ConsultationList';
import ConsultationForm from '../pages/Consultations/ConsultationForm';
import ConsultationDetails from '../pages/Consultations/ConsultationDetails';
import PrescriptionForm from '../pages/Prescriptions/PrescriptionForm';
import PrescriptionDetails from '../pages/Prescriptions/PrescriptionDetails';
import InvoiceList from '../pages/Billing/InvoiceList';
import InvoiceForm from '../pages/Billing/InvoiceForm';
import InvoiceDetails from '../pages/Billing/InvoiceDetails';
import StaffList from '../pages/Staff/StaffList';
import StaffForm from '../pages/Staff/StaffForm';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Home Route */}
      <Route path="/" element={<Home />} />

      {/* Auth Public Routes (redirect if already logged in) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* Protected Routes (require authentication) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />

          {/* Patients */}
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/patients/:id/edit" element={<PatientForm />} />

          {/* Doctors */}
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctors/new" element={<DoctorForm />} />
          <Route path="/doctors/schedules" element={<DoctorSchedules />} />

          {/* Departments */}
          <Route path="/departments" element={<DepartmentList />} />

          {/* Appointments */}
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/appointments/new" element={<AppointmentForm />} />

          {/* Consultations */}
          <Route path="/consultations" element={<ConsultationList />} />
          <Route path="/consultations/new/:appointmentId" element={<ConsultationForm />} />
          <Route path="/consultations/:id" element={<ConsultationDetails />} />

          {/* Prescriptions */}
          <Route path="/prescriptions/new/:consultationId" element={<PrescriptionForm />} />
          <Route path="/prescriptions/:id" element={<PrescriptionDetails />} />

          {/* Billing */}
          <Route path="/billing" element={<InvoiceList />} />
          <Route path="/billing/new" element={<InvoiceForm />} />
          <Route path="/billing/:id" element={<InvoiceDetails />} />

          {/* Staff */}
          <Route path="/staff" element={<StaffList />} />
          <Route path="/staff/new" element={<StaffForm />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
