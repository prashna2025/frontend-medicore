import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HeartPulse, ArrowRight, ShieldCheck, Activity, Users } from 'lucide-react';
import Button from '../components/Button';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="text-blue-600 w-7 h-7" />
            <span className="font-bold text-xl text-slate-800 tracking-tight">Medicore</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 mb-6">
          <Activity size={14} /> Modern Clinical ERP Platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight">
          Streamline Hospital Operations & Patient Care
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl">
          Comprehensive, intuitive platform for managing patient records, appointments, doctor schedules, prescriptions, and billing seamlessly.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to={isAuthenticated ? '/dashboard' : '/register'}>
            <Button size="lg" className="gap-2">
              <span>Get Started Now</span>
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Patient Records</h3>
            <p className="text-sm text-slate-600">Store and query patient profiles, blood groups, emergency contacts, and medical histories securely.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Activity size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Clinical Consultations</h3>
            <p className="text-sm text-slate-600">Record symptoms, diagnostic notes, and issue digital prescriptions instantly.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Secure & Compliant</h3>
            <p className="text-sm text-slate-600">Role-based permission controls ensuring total administrative and clinical privacy.</p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Medicore Healthcare Management Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
