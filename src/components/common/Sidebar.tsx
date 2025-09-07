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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <Logo size="sm" showText={false} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border-r-2 border-teal-700 dark:border-teal-300' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={LogOut}
            onClick={onLogout}
            fullWidth
          >
            Sign Out
          </Button>
        </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
