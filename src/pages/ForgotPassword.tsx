import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setServerError(null);
    try {
      await authService.forgotPassword({ email: values.email });
      setIsSent(true);
      toast.success('Password reset link sent to your email');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to send reset link.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center">Forgot Password</h2>
        <p className="text-sm text-slate-500 text-center mt-1">
          Enter your email to receive a password reset instructions
        </p>
      </div>

      <ErrorMessage message={serverError} />

      {isSent ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm text-center">
          <p className="font-semibold">Check your email</p>
          <p className="mt-1 text-xs text-emerald-700">
            We've sent password recovery instructions to your email address.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@medicore.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Send Reset Link
          </Button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link to="/login" className="text-xs text-blue-600 font-semibold hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
