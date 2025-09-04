import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
      toast.success('Account created successfully! Welcome to TerraPrice.');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different types of errors
      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        
        if (message.includes('email already registered') || 
            message.includes('user already exists') ||
            message.includes('email address is already registered')) {
          setError('An account with this email already exists. Please use a different email or try logging in.');
        } else if (message.includes('password') && message.includes('weak')) {
          setError('Password is too weak. Please choose a stronger password with at least 8 characters.');
        } else if (message.includes('invalid email') || message.includes('email format')) {
          setError('Please enter a valid email address.');
        } else if (message.includes('signup') && message.includes('disabled')) {
          setError('Account registration is currently disabled. Please contact support.');
        } else if (message.includes('too many requests') || message.includes('rate limit')) {
          setError('Too many registration attempts. Please wait a moment before trying again.');
        } else if (message.includes('network') || message.includes('fetch')) {
          setError('Network connection error. Please check your internet connection and try again.');
        } else {
          setError(err.message || 'Registration failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred during registration. Please try again.');
      }
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
