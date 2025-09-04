import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const NotFoundRedirect: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  // Redirect authenticated users to admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Redirect unauthenticated users to landing page
  return <Navigate to="/" replace />;
};

export default NotFoundRedirect;
