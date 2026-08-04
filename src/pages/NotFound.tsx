import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
        <FileQuestion size={32} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="mt-2 text-slate-600 max-w-md">
        The page you are looking for doesn't exist or has been moved to another URL.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button className="gap-2">
            <ArrowLeft size={18} />
            <span>Return to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
