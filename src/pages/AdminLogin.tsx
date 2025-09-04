import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../stores/authStore';
import { Logo } from '../components/ui/Logo';
import { Card } from '../components/ui/Card';
import LoginForm, { LoginFormData } from '../components/auth/LoginForm';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  const handleLogin = async (data: LoginFormData) => {
    console.log('Form submitted with data:', data);
    try {
      await login(data.email, data.password);
      toast.success('Login successful! Welcome back.');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different types of errors
      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        
        if (message.includes('invalid login credentials') || 
            message.includes('invalid email or password') ||
            message.includes('email not confirmed') ||
            message.includes('user not found') ||
            message.includes('wrong password')) {
          toast.error('Invalid email or password. Please check your credentials and try again.');
        } else if (message.includes('too many requests') || message.includes('rate limit')) {
          toast.error('Too many login attempts. Please wait a moment before trying again.');
        } else if (message.includes('network') || message.includes('fetch')) {
          toast.error('Network connection error. Please check your internet connection and try again.');
        } else {
          toast.error(err.message || 'Login failed. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
        
        </div>

        <Card>
          <LoginForm
            onSubmit={handleLogin}
          />
        </Card>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/admin/register')}
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            Don't have an account? Register here
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

export default AdminLogin;