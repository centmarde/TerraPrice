import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { loginValidationSchema } from '../../utils/validators';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error = '',
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    mode: 'onBlur', // Enable real-time validation on blur
    reValidateMode: 'onChange', // Re-validate on change after first validation
    defaultValues: { email: '', password: '' },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <Input
          {...register('email', loginValidationSchema.email)}
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          error={errors.email?.message}
          fullWidth
        />

        <Input
          {...register('password', loginValidationSchema.password)}
          type="password"
          placeholder="Enter your password"
          icon={Lock}
          error={errors.password?.message}
          fullWidth
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        fullWidth
        size="lg"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
export type { LoginFormData };
