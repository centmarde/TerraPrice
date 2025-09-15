import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileImage, 
  History,
//   Users, 
//   Settings, 
  LogOut,
  X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  const { user } = useAuthStore();

  const navigationItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/history', icon: History, label: 'Review History' },
    /* { to: '/admin/floorplans', icon: FileImage, label: 'Floorplans' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }, */
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 sm:w-72 lg:w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700
        ${sidebarOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 min-h-[64px]">
            <div className="flex items-center">
              <Logo size="sm" showText={true} />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors duration-200 touch-manipulation"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 overflow-y-auto">
          <ul className="space-y-1 lg:space-y-2">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center px-3 lg:px-4 py-3 lg:py-3 text-sm lg:text-sm font-medium rounded-xl transition-all duration-200 group touch-manipulation
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border-r-4 border-blue-600 dark:border-blue-400 shadow-lg backdrop-blur-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:shadow-md'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info and logout */}
        <div className="p-3 lg:p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm">
          <div className="mb-3 p-3 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.fullName || 'Admin User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'admin@terraprice.com'}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={LogOut}
            onClick={onLogout}
            fullWidth
            className="touch-manipulation hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:border-red-200 hover:text-red-700 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 dark:hover:border-red-800 dark:hover:text-red-400 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
          >
            <span className="text-xs lg:text-sm font-medium">Sign Out</span>
          </Button>
        </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
