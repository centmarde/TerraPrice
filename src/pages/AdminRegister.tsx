import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Logo } from '../components/ui/Logo';
import { Card } from '../components/ui/Card';
import RegisterForm, { RegisterFormData } from '../components/auth/RegisterForm';

const AdminRegister: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [error, setError] = useState<string>('');

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setError('');
      const fullName = `${data.firstName} ${data.lastName}`;
      await register(data.email, data.password, fullName);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create Admin Account
          </h2>
          <p className="text-gray-600">
            Register to access the admin dashboard
          </p>
        </div>

        <Card>
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />
        </Card>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/admin/login')}
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            Already have an account? Sign in
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
