import { RouteObject, Navigate } from 'react-router-dom';

// Layout components
import AdminLayout from '../components/layout/AdminLayout';

// Page components
import LandingPage from '../pages/LandingPage';
import AdminLogin from '../pages/AdminLogin';
import AdminRegister from '../pages/AdminRegister';
import Dashboard from '../pages/Dashboard';
import FloorplanList from '../pages/FloorplanList';
import FloorplanReview from '../pages/FloorplanReview';
import UsersPage from '../pages/UsersPage';
import SettingsPage from '../pages/SettingsPage';

// Auth guard components
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import NotFoundRedirect from './NotFoundRedirect';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    )
  },
  {
    path: '/admin/login',
    element: (
      <PublicRoute>
        <AdminLogin />
      </PublicRoute>
    )
  },
  {
    path: '/admin/register',
    element: (
      <PublicRoute>
        <AdminRegister />
      </PublicRoute>
    )
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'floorplans',
        element: <FloorplanList />
      },
      {
        path: 'floorplan/:id',
        element: <FloorplanReview />
      },
      {
        path: 'users',
        element: <UsersPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundRedirect />
  }
];
