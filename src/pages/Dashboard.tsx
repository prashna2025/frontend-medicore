import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import { User, Shield, Mail, Calendar, CheckCircle2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back, {user?.name || 'User'}!</p>
      </div>

      {/* User Information Card */}
      <Card title="User Information" subtitle="Current authenticated user details retrieved from backend">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Full Name</p>
              <p className="text-base font-semibold text-slate-800">{user?.name || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Email Address</p>
              <p className="text-base font-semibold text-slate-800">{user?.email || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Role Privilege</p>
              <span className="inline-block px-2.5 py-0.5 mt-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full capitalize">
                {user?.role || 'User'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Account ID</p>
              <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">{user?.id || 'N/A'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* System Status Summary */}
      <Card title="System Operational Status">
        <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-800 rounded-lg text-sm border border-emerald-200">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>Backend API Connected: Authentication context, Axios services, & JWT session active.</span>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
