import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { registerValidationSchema, ValidationMessages } from '../../utils/validators';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error = '',
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    mode: 'onBlur', // Enable real-time validation on blur
    reValidateMode: 'onChange', // Re-validate on change after first validation
  });

  const password = watch('password');

  // Show toast when error changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFormSubmit = async (data: RegisterFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('firstName', registerValidationSchema.firstName)}
            type="text"
            placeholder="First name"
            icon={User}
            error={errors.firstName?.message}
            fullWidth
          />

          <Input
            {...register('lastName', registerValidationSchema.lastName)}
            type="text"
            placeholder="Last name"
            icon={User}
            error={errors.lastName?.message}
            fullWidth
          />
        </div>

        <Input
          {...register('email', registerValidationSchema.email)}
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          error={errors.email?.message}
          fullWidth
        />

        <Input
          {...register('password', registerValidationSchema.password)}
          type="password"
          placeholder="Create a password"
          icon={Lock}
          error={errors.password?.message}
          fullWidth
        />

        <Input
          {...register('confirmPassword', { 
            required: ValidationMessages.PASSWORD_CONFIRM_REQUIRED,
            validate: (value) => value === password || ValidationMessages.PASSWORD_MISMATCH
          })}
          type="password"
          placeholder="Confirm your password"
          icon={Lock}
          error={errors.confirmPassword?.message}
          fullWidth
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        fullWidth
        size="lg"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
export type { RegisterFormData };
