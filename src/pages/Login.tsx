import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

const loginSchema = z.object({
  username: z.string().min(1, 'Please enter your username or email address'),
  password: z.string().min(1, 'Please enter your password'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const response = await authService.login({
        username: values.username,
        password: values.password,
        email: values.username,
      });
      login(response.token, response.user || response);
      navigate(from, { replace: true });
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center">Welcome back</h2>
        <p className="text-sm text-slate-500 text-center mt-1">Log in to access your account</p>
      </div>

      <ErrorMessage message={serverError} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username or Email"
          type="text"
          placeholder="admin / doctor / username"
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between text-xs">
          <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Log In
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 pt-2">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
