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
        <header className="sticky top-0 z-40 bg-gradient-to-r from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/70 dark:border-gray-700/70 transition-all duration-200">
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 gap-2 sm:gap-3">
            {/* Left side - Mobile menu button + Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-600 dark:text-gray-300 transition-all duration-200 touch-manipulation flex-shrink-0 shadow-sm hover:shadow-md"
                aria-label="Open sidebar menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent transition-all duration-200 truncate">
                TerraPrice Admin
              </h1>
            </div>

            {/* Right side - Theme toggle + Welcome message */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
              <ThemeToggle size="sm" />
              <div className="hidden md:block text-right p-2 rounded-lg lg:rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200 truncate max-w-24 lg:max-w-48">
                  Welcome, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.fullName?.split(' ')[0] || 'Admin'}</span>
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-gray-50/80 via-white/50 to-gray-100/80 dark:from-gray-900/80 dark:via-gray-800/50 dark:to-gray-900/80 min-h-0">
          <div className="h-full overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;