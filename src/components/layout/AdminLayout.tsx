import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import Navbar from '../common/Navbar';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navbar Component - Always visible on desktop, toggleable on mobile */}
      <Navbar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main content - Left margin on desktop to account for sidebar */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Sticky Top bar */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 gap-3">
            {/* Left side - Mobile menu button + Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200 touch-manipulation flex-shrink-0"
                aria-label="Open sidebar menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-200 truncate">
                TerraPrice Admin
              </h1>
            </div>

            {/* Right side - Theme toggle + Welcome message */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <ThemeToggle size="sm" />
              <div className="hidden sm:block text-right">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200 truncate max-w-32 sm:max-w-48">
                  Welcome, <span className="font-medium">{user?.fullName?.split(' ')[0] || 'Admin'}</span>
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;