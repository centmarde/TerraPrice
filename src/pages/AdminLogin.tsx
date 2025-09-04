import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Logo } from '../components/ui/Logo';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface LoginForm {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState<string>('');

  const demoCredentials = {
    email: 'admin@terraprice.com',
    password: 'admin123',
  };

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginForm>({
    defaultValues: demoCredentials,
  });

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const onSubmit = async (data: LoginForm) => {
    console.log('Form submitted with data:', data);
    try {
      setError('');
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Sign in to review floorplan submissions
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                placeholder="Enter your email"
                icon={Mail}
                error={errors.email?.message}
                fullWidth
              />

              <Input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
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

          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" onClick={() => {
              setValue('email', 'admin@terraprice.com');
              setValue('password', 'admin123');
            }}>
              Fill Demo Credentials
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <strong>Demo credentials:</strong><br />
              Email: admin@terraprice.com<br />
              Password: admin123
            </p>
          </div>
        </Card>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            ← Back to homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;