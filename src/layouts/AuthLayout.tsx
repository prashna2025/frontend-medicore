import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <HeartPulse className="text-blue-600 w-8 h-8" />
          <span className="font-bold text-2xl text-slate-900 tracking-tight">Medicore</span>
        </Link>
        <p className="text-sm text-slate-500">Hospital & Healthcare Management System</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
