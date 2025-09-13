import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Navbar from '../common/Navbar';
import { ThemeToggle } from '../ui/ThemeToggle';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Sidebar and header are siblings, both fixed/sticky, main content always below header and beside sidebar */}
      <Navbar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Header - always on top, never covered by sidebar */}
      <header className="admin-header bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-200 sticky top-0 z-[60] w-full h-16 px-4 sm:px-6">
        {/* Left: Mobile menu button */}
        <div className="flex items-center h-full">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/80 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-105"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        {/* Center: Title */}
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gradient-to-b from-teal-500 to-blue-600 rounded-full"></div>
            <h1 className="header-title text-xl lg:text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <div className="sm:hidden w-full text-center">
            <h1 className="header-title text-lg font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
        </div>
        {/* Right: Theme toggle and Welcome */}
        <div className="flex items-center h-full gap-2">
          <ThemeToggle size="sm" />
          <div className="hidden lg:block">
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 px-4 py-2 rounded-full">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 whitespace-nowrap">
                Welcome, <span className="text-teal-600 dark:text-teal-400 font-semibold">{user?.fullName || 'Admin'}</span>
              </p>
            </div>
          </div>
          <div className="lg:hidden w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center ml-2">
            <span className="text-white text-sm font-semibold">
              {user?.fullName?.charAt(0) || 'A'}
            </span>
          </div>
        </div>
      </header>

      {/* Main content - always below header, beside sidebar on desktop */}
      <main className="pt-16 lg:ml-64 p-4 sm:p-6 min-h-[calc(100vh-64px)] transition-all duration-200">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;