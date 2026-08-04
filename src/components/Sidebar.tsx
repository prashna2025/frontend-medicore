import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Building2, 
  Calendar, 
  FileText, 
  CreditCard, 
  UserCheck, 
  User,
  ShieldAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'PATIENT';

  const allNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'] },
    { name: 'Patients', path: '/patients', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
    { name: 'Doctors', path: '/doctors', icon: Stethoscope, roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
    { name: 'Departments', path: '/departments', icon: Building2, roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST'] },
    { name: 'Appointments', path: '/appointments', icon: Calendar, roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'] },
    { name: 'Consultations', path: '/consultations', icon: FileText, roles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT'] },
    { name: 'Billing', path: '/billing', icon: CreditCard, roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'PATIENT'] },
    { name: 'Staff', path: '/staff', icon: UserCheck, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Profile', path: '/profile', icon: User, roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'] },
  ];

  const visibleItems = allNavItems.filter((item) =>
    role === 'SUPER_ADMIN' || item.roles.includes(role)
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col min-h-[calc(100vh-4rem)] p-4">
      {user && (
        <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <ShieldAlert size={18} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role</p>
            <p className="text-sm font-bold text-slate-800">{role.replace('_', ' ')}</p>
          </div>
        </div>
      )}
      <nav className="flex-1 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
