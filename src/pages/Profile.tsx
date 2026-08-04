import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setServerError(null);
    try {
      const updatedUser = await userService.updateProfile(values);
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
        <p className="text-sm text-slate-500">Manage your personal account settings and details</p>
      </div>

      <Card>
        <ErrorMessage message={serverError} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <Input
            label="Full Name"
            type="text"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="pt-4 flex justify-end">
            <Button type="submit" isLoading={isSubmitting}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
