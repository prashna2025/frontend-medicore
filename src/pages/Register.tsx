import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import Button from '../components/Button';

export const Register: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <ShieldAlert size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Managed Registration</h2>
        <p className="text-sm text-slate-500 mt-1">Self-registration is disabled in MediCore Hospital Management System.</p>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-sm text-slate-600">
        <div className="flex items-start gap-3">
          <UserCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <p>
            User accounts (Doctors, Receptionists, and Staff) are created and managed by System Administrators through the <span className="font-semibold text-slate-800">Staff & Doctor Management</span> module.
          </p>
        </div>
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
          <p className="font-semibold mb-1">Initial System Credentials:</p>
          <p>• Super Admin Username: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-blue-200">dikshanta8080</code></p>
          <p className="mt-0.5">• Password: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-blue-200">root</code></p>
        </div>
      </div>

      <Link to="/login" className="block">
        <Button type="button" fullWidth className="flex items-center justify-center gap-2">
          <span>Go to Login Page</span>
          <ArrowRight size={18} />
        </Button>
      </Link>
    </div>
  );
};

export default Register;

