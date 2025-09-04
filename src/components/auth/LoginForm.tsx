import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { loginValidationSchema } from '../../utils/validators';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  error = '',
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    mode: 'onBlur', // Enable real-time validation on blur
    reValidateMode: 'onChange', // Re-validate on change after first validation
    defaultValues: { email: '', password: '' },
  });

  // Show toast when error changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFormSubmit = async (data: LoginFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
        fullWidth
        size="lg"
      >
        Sign In
      </Button>
      </form>
    </div>
  );
};

export default LoginForm;
export type { LoginFormData };
