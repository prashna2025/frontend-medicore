import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, HeartPulse } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <HeartPulse className="text-blue-600 w-7 h-7" />
          <span className="font-bold text-xl text-slate-800 tracking-tight">Medicore</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:inline">{user?.name}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
