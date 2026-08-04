import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <AlertCircle size={18} className="shrink-0 text-red-500" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
